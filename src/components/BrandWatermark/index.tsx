'use client';

import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

const BrandWatermark = memo<Omit<FlexboxProps, 'children'>>(({ style, ...rest }) => {
  return (
    <Flexbox
      align={'center'}
      flex={'none'}
      gap={4}
      horizontal
      style={{ fontSize: 12, ...style }}
      {...rest}
    >
      {/* <span>Powered by</span>
      <Link
        href={`https://lobehub.com?utm_source=${UTM_SOURCE}&utm_content=brand_watermark`}
        target={'_blank'}
      >
        <LobeHub size={20} type={'text'} />
      </Link> */}
    </Flexbox>
  );
});

export default BrandWatermark;
