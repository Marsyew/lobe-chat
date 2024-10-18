import { readableFromAsyncIterable } from 'ai';
import OpenAI from 'openai';
import type { Stream } from 'openai/streaming';

import { ChatMessageError } from '@/types/message';

import { ChatStreamCallbacks } from '../../types';
import {
  StreamProtocolChunk,
  StreamProtocolToolCallChunk,
  StreamStack,
  StreamToolCallChunkData,
  createCallbacksTransformer,
  createSSEProtocolTransformer,
  generateToolCallId,
} from './protocol';

export const transformOpenAIStream = (
  chunk: OpenAI.ChatCompletionChunk,
  stack?: StreamStack,
): StreamProtocolChunk => {
  // maybe need another structure to add support for multiple choices
  console.log('Transforming OpenAI stream chunk:', chunk);

  try {
    const item = chunk.choices[0];
    if (!item) {
      return { data: chunk, id: chunk.id, type: 'data' };
    }

    if (item.delta?.tool_calls) {
      return {
        data: item.delta.tool_calls.map((value, index): StreamToolCallChunkData => {
          console.log(`Processing tool call #${index}:`, value);
          if (stack && !stack.tool) {
            stack.tool = { id: value.id!, index: value.index, name: value.function!.name! };
            console.log('Tool stack updated:', stack.tool);
          }

          return {
            function: {
              arguments: value.function?.arguments ?? '{}',
              name: value.function?.name ?? null,
            },
            id: value.id || stack?.tool?.id || generateToolCallId(index, value.function?.name),

            // mistral's tool calling don't have index and function field, it's data like:
            // [{"id":"xbhnmTtY7","function":{"name":"lobe-image-designer____text2image____builtin","arguments":"{\"prompts\": [\"A photo of a small, fluffy dog with a playful expression and wagging tail.\", \"A watercolor painting of a small, energetic dog with a glossy coat and bright eyes.\", \"A vector illustration of a small, adorable dog with a short snout and perky ears.\", \"A drawing of a small, scruffy dog with a mischievous grin and a wagging tail.\"], \"quality\": \"standard\", \"seeds\": [123456, 654321, 111222, 333444], \"size\": \"1024x1024\", \"style\": \"vivid\"}"}}]

            // minimax's tool calling don't have index field, it's data like:
            // [{"id":"call_function_4752059746","type":"function","function":{"name":"lobe-image-designer____text2image____builtin","arguments":"{\"prompts\": [\"一个流浪的地球，背景是浩瀚"}}]

            // so we need to add these default values
            index: typeof value.index !== 'undefined' ? value.index : index,
            type: value.type || 'function',
          };
        }),
        id: chunk.id,
        type: 'tool_calls',
      } as StreamProtocolToolCallChunk;
    }

    // 给定结束原因
    if (item.finish_reason) {
      // one-api 的流式接口，会出现既有 finish_reason ，也有 content 的情况
      //  {"id":"demo","model":"deepl-en","choices":[{"index":0,"delta":{"role":"assistant","content":"Introduce yourself."},"finish_reason":"stop"}]}
      console.log('Finish reason detected:', item.finish_reason);

      if (typeof item.delta?.content === 'string' && !!item.delta.content) {
        console.log('Returning content with finish reason.');
        return { data: item.delta.content, id: chunk.id, type: 'text' };
      }

      return { data: item.finish_reason, id: chunk.id, type: 'stop' };
    }

    if (typeof item.delta?.content === 'string') {
      console.log('Returning text content:', item.delta.content);
      return { data: item.delta.content, id: chunk.id, type: 'text' };
    }

    if (item.delta?.content === null) {
      console.log('Content is null, returning data.');
      return { data: item.delta, id: chunk.id, type: 'data' };
    }

    console.log('Returning delta and index:', item.delta, item.index);

    // 其余情况下，返回 delta 和 index
    return {
      data: { delta: item.delta, id: chunk.id, index: item.index },
      id: chunk.id,
      type: 'data',
    };
  } catch (e) {
    const errorName = 'StreamChunkError';
    console.error(`[${errorName}]`, e);
    console.error(`[${errorName}] raw chunk:`, chunk);

    const err = e as Error;

    /* eslint-disable sort-keys-fix/sort-keys-fix */
    const errorData = {
      body: {
        message:
          'chat response streaming chunk parse error, please contact your API Provider to fix it.',
        context: { error: { message: err.message, name: err.name }, chunk },
      },
      type: 'StreamChunkError',
    } as ChatMessageError;
    /* eslint-enable */

    return { data: errorData, id: chunk.id, type: 'error' };
  }
};

const chatStreamable = async function* (stream: AsyncIterable<OpenAI.ChatCompletionChunk>) {
  for await (const response of stream) {
    console.log('Received response chunk from stream:', response);
    yield response;
  }
};

export const OpenAIStream = (
  stream: Stream<OpenAI.ChatCompletionChunk> | ReadableStream,
  callbacks?: ChatStreamCallbacks,
) => {
  const streamStack: StreamStack = { id: '' };

  const readableStream =
    stream instanceof ReadableStream ? stream : readableFromAsyncIterable(chatStreamable(stream));
  console.log('Readable stream created, piping through transformers...');

  return readableStream
    .pipeThrough(createSSEProtocolTransformer(transformOpenAIStream, streamStack))
    .pipeThrough(createCallbacksTransformer(callbacks));
};
