import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44389/',
  redirectUri: baseUrl,
  clientId: 'OwneyBeauty_App',
  responseType: 'code',
  scope: 'offline_access OwneyBeauty',
  requireHttps: true,
};

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'OwneyBeauty',
  },
  oAuthConfig,
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
} as Environment;
