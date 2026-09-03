import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ConfigStateService,
  LanguageInfo,
  LocalizationPipe,
  LocalizationService,
  SessionStateService,
} from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { finalize, switchMap } from 'rxjs';
import { AuthenticationService } from '../../proxy/authentication';
import { TenantContextService } from '../../proxy/tenants';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LocalizationPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly authenticated = output<void>();
  private readonly fb = inject(FormBuilder);
  private readonly authentication = inject(AuthenticationService);
  private readonly tenants = inject(TenantContextService);
  private readonly session = inject(SessionStateService);
  private readonly config = inject(ConfigStateService);
  private readonly localization = inject(LocalizationService);
  private readonly toaster = inject(ToasterService);
  private readonly confirmation = inject(ConfirmationService);

  readonly languages = (this.config.getDeep('localization.languages') as LanguageInfo[]) ?? [];
  readonly currentLanguage = signal(this.session.getLanguage());
  readonly theme = signal<Theme>((localStorage.getItem('owney-theme') as Theme) || 'light');
  readonly passwordVisible = signal(false);
  readonly submitting = signal(false);
  readonly tenantName = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    companyCode: ['', [Validators.maxLength(64)]],
    username: ['', [Validators.required, Validators.maxLength(256)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]],
    rememberMe: [true],
  });

  constructor() {
    effect(() => {
      const theme = this.theme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('owney-theme', theme);
    });
  }

  setLanguage(language: string) {
    this.currentLanguage.set(language);
    this.session.setLanguage(language);
    document.documentElement.lang = language;
  }

  toggleTheme() { this.theme.update(theme => theme === 'light' ? 'dark' : 'light'); }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toaster.warn(this.localization.instant('::Login.InvalidForm'));
      return;
    }

    this.submitting.set(true);
    const value = this.form.getRawValue();
    this.tenants.select(value.companyCode).pipe(
      switchMap(tenantName => {
        this.tenantName.set(tenantName);
        if (tenantName) {
          this.toaster.info(this.localization.instant('::Login.TenantConnected', tenantName));
        }
        return this.authentication.login(value);
      }),
      finalize(() => this.submitting.set(false)),
    ).subscribe({
      next: () => {
        this.toaster.success(this.localization.instant('::Login.Success'));
        this.authenticated.emit();
      },
      error: () => this.toaster.error(this.localization.instant('::Login.Error')),
    });
  }

  recoverPassword() {
    this.confirmation.info('::Login.RecoveryMessage', '::Login.RecoveryTitle', {
      yesText: this.localization.instant('::Login.Continue'),
      cancelText: this.localization.instant('::Login.Cancel'),
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) window.location.assign('/account/forgot-password');
    });
  }

  hasError(control: 'companyCode' | 'username' | 'password') {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || field.dirty);
  }
}
