import { inject, Injectable } from '@angular/core';
import { ConfigStateService, MultiTenancyService, SessionStateService } from '@abp/ng.core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private readonly multiTenancy = inject(MultiTenancyService);
  private readonly session = inject(SessionStateService);
  private readonly config = inject(ConfigStateService);

  select(companyCode: string): Observable<string | null> {
    const normalizedCode = companyCode.trim();
    if (!normalizedCode) {
      this.session.setTenant(null);
      return this.config.refreshAppState().pipe(map(() => null));
    }

    return this.multiTenancy.setTenantByName(normalizedCode).pipe(
      map(tenant => tenant.name ?? normalizedCode),
    );
  }
}
