import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SessionStateService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { catchError, throwError } from 'rxjs';

const CRITICAL_WRITE_PATHS = ['/api/accounts/registration/register', '/api/accounts/legal-document/admin', '/api/platform/admin/'];

export const languageInterceptor: HttpInterceptorFn = (request, next) => {
  const language = inject(SessionStateService).getLanguage() || 'es';
  return next(request.clone({ setHeaders: { 'Accept-Language': language } }));
};

export const idempotencyInterceptor: HttpInterceptorFn = (request, next) => {
  const isWrite = ['POST', 'PUT', 'PATCH'].includes(request.method);
  const isCritical = CRITICAL_WRITE_PATHS.some(path => request.url.includes(path));
  if (!isWrite || !isCritical || request.headers.has('Idempotency-Key')) return next(request);
  return next(request.clone({ setHeaders: { 'Idempotency-Key': crypto.randomUUID() } }));
};

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const toaster = inject(ToasterService);
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(request).pipe(catchError((error: unknown) => {
    if (!(error instanceof HttpErrorResponse)) return throwError(() => error);
    const payload = error.error as { error?: { message?: string } } | undefined;
    const message = payload?.error?.message;
    if (error.status === 401 && !request.url.includes('/connect/token')) {
      void auth.refreshToken().catch(() => router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } }));
    } else if (error.status === 403) {
      void router.navigate(['/sin-permiso']);
    } else if (error.status === 429) {
      toaster.warn(`Demasiadas solicitudes. Intenta nuevamente en ${error.headers.get('Retry-After') ?? 'unos'} segundos.`);
    } else if (error.status === 409 || error.status === 422) {
      toaster.error(message || 'No se pudo confirmar la operación. Revisa los datos antes de reintentar.');
    } else if (error.status !== 0 && message) {
      toaster.error(message);
    }
    return throwError(() => error);
  }));
};
