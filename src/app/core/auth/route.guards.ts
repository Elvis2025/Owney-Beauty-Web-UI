import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, PermissionService } from '@abp/ng.core';
import { AccountMode } from '../api-temp/accounts-api.service';
import { AccountStore } from './account.store';

export const authGuard:CanActivateFn=(_,state)=>{const auth=inject(AuthService);return auth.isAuthenticated?true:inject(Router).createUrlTree(['/auth/login'],{queryParams:{returnUrl:state.url}})};
export const permissionGuard:CanActivateFn=route=>{const policy=route.data['permission'] as string|undefined;return !policy||inject(PermissionService).getGrantedPolicy(policy)?true:inject(Router).createUrlTree(['/sin-permiso'])};
export const modeGuard:CanActivateFn=route=>{const mode=route.data['mode'] as AccountMode|undefined;return !mode||inject(AccountStore).activeMode()===mode?true:inject(Router).createUrlTree(['/cuenta'])};
