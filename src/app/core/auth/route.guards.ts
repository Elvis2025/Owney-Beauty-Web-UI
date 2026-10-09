import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, PermissionService } from '@abp/ng.core';
import { AccountMode } from '../api-temp/accounts-api.service';
import { AccountStore } from './account.store';
import { map } from 'rxjs';

export const authGuard:CanActivateFn=(_,state)=>{const auth=inject(AuthService);return auth.isAuthenticated?true:inject(Router).createUrlTree(['/auth/login'],{queryParams:{returnUrl:state.url}})};
export const permissionGuard:CanActivateFn=route=>{const policy=route.data['permission'] as string|undefined;return !policy||inject(PermissionService).getGrantedPolicy(policy)?true:inject(Router).createUrlTree(['/sin-permiso'])};
export const modeGuard:CanActivateFn=route=>{const mode=route.data['mode'] as AccountMode|undefined;const store=inject(AccountStore);const router=inject(Router);if(!mode)return true;if(store.account())return store.activeMode()===mode?true:router.createUrlTree(['/cuenta']);return store.load().pipe(map(()=>store.activeMode()===mode?true:router.createUrlTree(['/cuenta'])))};
