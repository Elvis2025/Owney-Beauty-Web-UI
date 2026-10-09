import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAccountConfig } from '@abp/ng.account/config';
import { provideAbpCore, withOptions } from '@abp/ng.core';
import { registerLocaleForEsBuild } from '@abp/ng.core/locale';
import { provideFeatureManagementConfig } from '@abp/ng.feature-management';
import { provideIdentityConfig } from '@abp/ng.identity/config';
import { provideAbpOAuth } from '@abp/ng.oauth';
import { provideSettingManagementConfig } from '@abp/ng.setting-management/config';
import { provideAbpThemeShared, provideLogo, withEnvironmentOptions } from '@abp/ng.theme.shared';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { apiErrorInterceptor, idempotencyInterceptor, languageInterceptor } from './core/http/http.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideAnimations(),
    provideHttpClient(withInterceptors([languageInterceptor, idempotencyInterceptor, apiErrorInterceptor])),
    provideAbpCore(withOptions({ environment, registerLocaleFn: registerLocaleForEsBuild() })),
    provideAbpOAuth(),
    provideIdentityConfig(),
    provideSettingManagementConfig(),
    provideFeatureManagementConfig(),
    provideLogo(withEnvironmentOptions(environment)),
    provideAccountConfig(),
    provideAbpThemeShared(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
