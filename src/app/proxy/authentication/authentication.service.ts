import { inject, Injectable } from '@angular/core';
import { AuthService } from '@abp/ng.core';
import { LoginRequest } from './models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly auth = inject(AuthService);

  login(request: LoginRequest) {
    return this.auth.login(request);
  }
}
