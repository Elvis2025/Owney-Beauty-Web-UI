import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AsyncLocalizationPipe,
  ConfigStateService,
  LanguageInfo,
  LocalizationService,
  SessionStateService,
} from '@abp/ng.core';
import { AsyncPipe } from '@angular/common';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { finalize, switchMap } from 'rxjs';
import { AuthenticationService } from '../../proxy/authentication';
import { TenantContextService } from '../../proxy/tenants';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AsyncLocalizationPipe, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
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
  readonly languageMenuOpen = signal(false);
  readonly languageQuery = signal('');
  readonly filteredLanguages = computed(() => {
    const query = this.normalizeLanguageText(this.languageQuery());
    if (!query) return this.languages;

    return this.languages.filter(language =>
      [language.displayName, language.cultureName, language.twoLetterISOLanguageName]
        .some(value => this.normalizeLanguageText(value).includes(query)),
    );
  });
  readonly submitting = signal(false);
  readonly tenantName = signal<string | null>(null);

  private languageOpenTimer?: ReturnType<typeof setTimeout>;
  private languageCloseTimer?: ReturnType<typeof setTimeout>;

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
    if (!language) return;

    this.currentLanguage.set(language);
    this.session.setLanguage(language);
    document.documentElement.lang = language;
    this.closeLanguageMenu();
  }

  selectedLanguage() {
    return this.languages.find(language => language.cultureName === this.currentLanguage());
  }

  languageLabel(language?: LanguageInfo) {
    return (language?.twoLetterISOLanguageName || language?.cultureName || this.currentLanguage().slice(0, 2)).toUpperCase();
  }

  scheduleLanguageMenuOpen() {
    this.clearLanguageTimers();
    this.languageOpenTimer = setTimeout(() => this.languageMenuOpen.set(true), 1000);
  }

  scheduleLanguageMenuClose() {
    clearTimeout(this.languageOpenTimer);
    this.languageCloseTimer = setTimeout(() => this.closeLanguageMenu(), 180);
  }

  toggleLanguageMenu(event: Event) {
    event.stopPropagation();
    this.clearLanguageTimers();
    if (this.languageMenuOpen()) {
      this.closeLanguageMenu();
      return;
    }

    this.languageMenuOpen.set(true);
  }

  updateLanguageQuery(event: Event) {
    this.languageQuery.set((event.target as HTMLInputElement).value);
  }

  clearLanguageQuery(event: Event) {
    event.stopPropagation();
    this.languageQuery.set('');
  }

  selectLanguage(language: string, event: Event) {
    event.stopPropagation();
    this.setLanguage(language);
  }

  @HostListener('document:pointerdown')
  closeLanguageMenu() {
    this.clearLanguageTimers();
    this.languageMenuOpen.set(false);
    this.languageQuery.set('');
  }

  ngOnDestroy() {
    this.clearLanguageTimers();
  }

  private clearLanguageTimers() {
    clearTimeout(this.languageOpenTimer);
    clearTimeout(this.languageCloseTimer);
  }

  private normalizeLanguageText(value?: string) {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase();
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
        return this.authentication.login({
          username: value.username.trim(),
          password: value.password,
          rememberMe: value.rememberMe,
        });
      }),
      finalize(() => this.submitting.set(false)),
    ).subscribe({
      next: () => {
        this.toaster.success(this.localization.instant('::Login.Success'));
        this.authenticated.emit();
      },
      error: error => this.toaster.error(this.resolveLoginError(error)),
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

  private resolveLoginError(error: unknown) {
    const fallback = this.localization.instant('::Login.Error');
    const httpError = error instanceof HttpErrorResponse
      ? error
      : (error as { reason?: unknown } | null)?.reason;

    if (!(httpError instanceof HttpErrorResponse)) return fallback;

    const payload = httpError.error as {
      error_description?: unknown;
      error?: { message?: unknown } | string;
    } | null;
    const message = payload?.error_description
      ?? (typeof payload?.error === 'object' ? payload.error?.message : undefined);

    return typeof message === 'string' && message.trim() ? message : fallback;
  }
}
