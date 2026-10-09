import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SessionStateService } from '@abp/ng.core';
import { firstValueFrom, of } from 'rxjs';
import { idempotencyInterceptor, languageInterceptor } from './http.interceptors';

describe('interceptores HTTP', () => {
  it('envía el idioma activo', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: SessionStateService, useValue: { getLanguage: () => 'es' } }] });
    let captured: HttpRequest<unknown> | undefined;
    const next: HttpHandlerFn = request => { captured = request; return of(new HttpResponse({ status: 200 })); };
    await firstValueFrom(TestBed.runInInjectionContext(() => languageInterceptor(new HttpRequest('GET', '/api/test'), next)));
    expect(captured?.headers.get('Accept-Language')).toBe('es');
  });

  it('agrega idempotencia solo a escrituras críticas', async () => {
    let critical: HttpRequest<unknown> | undefined;
    const next: HttpHandlerFn = request => { critical = request; return of(new HttpResponse({ status: 200 })); };
    await firstValueFrom(idempotencyInterceptor(new HttpRequest('POST', '/api/accounts/registration/register', {}), next));
    expect(critical?.headers.get('Idempotency-Key')).toMatch(/^[0-9a-f-]{36}$/i);

    let ordinary: HttpRequest<unknown> | undefined;
    await firstValueFrom(idempotencyInterceptor(new HttpRequest('POST', '/api/other', {}), request => { ordinary = request; return of(new HttpResponse({ status: 200 })); }));
    expect(ordinary?.headers.has('Idempotency-Key')).toBe(false);
  });
});
