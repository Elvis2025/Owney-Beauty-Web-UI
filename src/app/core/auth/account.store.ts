import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize, switchMap, tap } from 'rxjs';
import { AccountMode, AccountsApiService, MyAccountDto } from '../api-temp/accounts-api.service';

@Injectable({ providedIn: 'root' })
export class AccountStore {
  private readonly api=inject(AccountsApiService);
  readonly account=signal<MyAccountDto|null>(null);
  readonly loading=signal(false);
  readonly activeMode=computed(()=>this.account()?.activeMode ?? AccountMode.Client);
  readonly pendingLegal=computed(()=>this.account()?.pendingLegalDocuments ?? []);

  load(){this.loading.set(true);return this.api.getMyAccount().pipe(tap(account=>this.account.set(account)),finalize(()=>this.loading.set(false)))}
  switchMode(mode:AccountMode){this.loading.set(true);return this.api.switchMode(mode).pipe(tap(account=>this.account.set(account)),finalize(()=>this.loading.set(false)))}
  enableProfessional(){this.loading.set(true);return this.api.enableMode(AccountMode.Professional).pipe(switchMap(()=>this.api.switchMode(AccountMode.Professional)),tap(account=>this.account.set(account)),finalize(()=>this.loading.set(false)))}
  acceptPending(){const ids=this.pendingLegal().map(item=>item.id);this.loading.set(true);return this.api.acceptLegalDocuments(ids).pipe(tap(account=>this.account.set(account)),finalize(()=>this.loading.set(false)))}
}
