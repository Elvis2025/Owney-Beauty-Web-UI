import { inject, Injectable } from '@angular/core';
import { MultiTenancyService, SessionStateService } from '@abp/ng.core';
import { map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private readonly multiTenancy = inject(MultiTenancyService);
  private readonly session = inject(SessionStateService);
  select(companyCode: string): Observable<string | null> {
    const normalizedCode = companyCode.trim();
    if (!normalizedCode) {
      this.session.setTenant(null);
      return of(null);
    }

    return this.multiTenancy.setTenantByName(normalizedCode).pipe(
      map(tenant => tenant.name ?? normalizedCode),
    );
  }
}
