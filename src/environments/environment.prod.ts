import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44389/',
  redirectUri: baseUrl,
  clientId: 'OwneyBeauty_App',
  responseType: 'password',
  oidc: false,
  scope: 'offline_access OwneyBeauty',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'OwneyBeauty',
  },
  oAuthConfig,
  authCodePkce: false,
  apis: {
    default: {
      url: 'https://localhost:44389',
      rootNamespace: 'Ieh.OwneyBeauty',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge'
  }
} as Environment;
