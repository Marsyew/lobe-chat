// // import AzureAD from 'next-auth/providers/azure-ad';
// // import { authEnv } from '@/config/auth';
// // import { CommonProviderConfig } from './sso.config';
// // const provider = {
// //   id: 'azure-ad',
// //   provider: AzureAD({
// //     ...CommonProviderConfig,
// //     // Specify auth scope, at least include 'openid email'
// //     // all scopes in Azure AD ref: https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc#openid-connect-scopes
// //     authorization: { params: { scope: 'openid email profile' } },
// //     // TODO(NextAuth ENVs Migration): Remove once nextauth envs migration time end
// //     clientId: authEnv.AZURE_AD_CLIENT_ID ?? process.env.AUTH_AZURE_AD_ID,
// //     clientSecret: authEnv.AZURE_AD_CLIENT_SECRET ?? process.env.AUTH_AZURE_AD_SECRET,
// //     // tenantId: authEnv.AZURE_AD_TENANT_ID ?? process.env.AUTH_AZURE_AD_TENANT_ID,
// //     // Remove end
// //     // TODO(NextAuth): map unique user id to `providerAccountId` field
// //     // profile(profile) {
// //     //   return {
// //     //     email: profile.email,
// //     //     image: profile.picture,
// //     //     name: profile.name,
// //     //     providerAccountId: profile.user_id,
// //     //   };
// //     // },
// //   }),
// // };
// // export default provider;
// import AzureAD from 'next-auth/providers/azure-ad';

// import { authEnv } from '@/config/auth';

// import { CommonProviderConfig } from './sso.config';

// const provider = {
//   id: 'azure-ad',
//   provider: AzureAD({
//     ...CommonProviderConfig,
//     // Specify auth scope, at least include 'openid email'
//     // All scopes in Azure AD ref: https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc#openid-connect-scopes
//     authorization: {
//       params: { scope: 'openid email profile' },
//       url: `https://login.microsoftonline.com/${authEnv.AZURE_AD_TENANT_ID ?? process.env.AUTH_AZURE_AD_TENANT_ID}/oauth2/v2.0/authorize`,
//     },
//     clientId: authEnv.AZURE_AD_CLIENT_ID ?? process.env.AUTH_AZURE_AD_ID,
//     clientSecret: authEnv.AZURE_AD_CLIENT_SECRET ?? process.env.AUTH_AZURE_AD_SECRET,
//   }),
// };

// export default provider;
import AzureAD from 'next-auth/providers/azure-ad';

import { authEnv } from '@/config/auth';

const provider = {
  id: 'azure-ad',
  provider: AzureAD({
    authorization: {
      url: `https://login.microsoftonline.com/${authEnv.AZURE_AD_TENANT_ID ?? process.env.AUTH_AZURE_AD_TENANT_ID}/oauth2/v2.0/authorize`,
      params: { scope: 'openid email profile' },
    },
    clientId: authEnv.AZURE_AD_CLIENT_ID ?? process.env.AUTH_AZURE_AD_ID,
    clientSecret: authEnv.AZURE_AD_CLIENT_SECRET ?? process.env.AUTH_AZURE_AD_SECRET,
    // 其他配置...
  }),
};

export default provider;
