import { Injectable, inject } from '@angular/core';
import { RestService } from '@abp/ng.core';

// TODO: reemplazar por proxy generado
export enum AccountMode { Client = 1, Professional = 2, Business = 3 }
export enum OnboardingStep { None = 0, AccountCreated = 1, ContactVerified = 2, ProfileStarted = 3 }
export enum VerificationChannel { Email = 1, Phone = 2 }
export enum LegalDocumentType { TermsAndConditions = 1, PrivacyPolicy = 2, CookiePolicy = 3, ProfessionalAgreement = 4, BusinessAgreement = 5 }
export enum ConsentType { TermsAndConditions = 1, PrivacyPolicy = 2, Marketing = 3 }

export interface RegisterDto {
  email?: string; phoneNumber?: string; userName?: string; name: string; surname?: string;
  password: string; initialMode: AccountMode; acceptedLegalDocumentIds: string[]; marketingConsent: boolean; language: string;
}
export interface RegistrationResultDto { userId: string; userName: string; activeMode: AccountMode; requiresEmailVerification: boolean; requiresPhoneVerification: boolean }
export interface PublicLegalDocumentDto { id: string; type: LegalDocumentType; language: string; version: string; title: string; content?: string; externalUrl?: string; requiresAcceptance: boolean; publishedTime?: string }
export interface VerificationCodeSentDto { channel: VerificationChannel; maskedTarget: string; expiresAt: string }
export interface MyAccountDto { id: string; userName: string; name?: string; surname?: string; email?: string; emailConfirmed: boolean; phoneNumber?: string; phoneNumberConfirmed: boolean; roles: string[]; availableModes: AccountMode[]; activeMode: AccountMode; onboardingStep: OnboardingStep; pendingLegalDocuments: PublicLegalDocumentDto[] }
export interface ConsentStatusDto { type: ConsentType; granted: boolean; updatedAt?: string }
export interface ListResultDto<T> { items: T[] }
export interface ResetPasswordDto { userId?: string; resetToken: string; password: string }
export interface SendPasswordResetCodeDto { email: string; appName: string; returnUrl?: string; returnUrlHash?: string }

@Injectable({ providedIn: 'root' })
export class AccountsApiService {
  private readonly rest = inject(RestService);
  private readonly config = { apiName: 'default' };

  register(input: RegisterDto) { return this.rest.request<RegisterDto, RegistrationResultDto>({ method: 'POST', url: '/api/accounts/registration/register', body: input }, this.config); }
  getCurrentLegalDocuments(language = 'es') { return this.rest.request<void, ListResultDto<PublicLegalDocumentDto>>({ method: 'GET', url: '/api/accounts/legal-document/current', params: { language } }, this.config); }
  sendEmailCode() { return this.rest.request<void, VerificationCodeSentDto>({ method: 'POST', url: '/api/accounts/verification/send-email-code' }, this.config); }
  confirmEmail(code: string) { return this.rest.request<{code:string}, void>({ method: 'POST', url: '/api/accounts/verification/confirm-email', body: { code } }, this.config); }
  sendPhoneCode(phoneNumber?: string) { return this.rest.request<{phoneNumber?:string}, VerificationCodeSentDto>({ method: 'POST', url: '/api/accounts/verification/send-phone-code', body: { phoneNumber } }, this.config); }
  confirmPhone(code: string) { return this.rest.request<{code:string}, void>({ method: 'POST', url: '/api/accounts/verification/confirm-phone', body: { code } }, this.config); }
  sendPasswordResetCode(input: SendPasswordResetCodeDto) { return this.rest.request<SendPasswordResetCodeDto, void>({ method: 'POST', url: '/api/account/send-password-reset-code', body: input }, { apiName: 'AbpAccountPublic' }); }
  verifyPasswordResetToken(input: { userId: string; resetToken: string }) { return this.rest.request<typeof input, boolean>({ method: 'POST', url: '/api/account/verify-password-reset-token', body: input }, { apiName: 'AbpAccountPublic' }); }
  resetPassword(input: ResetPasswordDto) { return this.rest.request<ResetPasswordDto, void>({ method: 'POST', url: '/api/account/reset-password', body: input }, { apiName: 'AbpAccountPublic' }); }

  getMyAccount() { return this.rest.request<void, MyAccountDto>({ method: 'GET', url: '/api/accounts/my-account' }, this.config); }
  switchMode(mode: AccountMode) { return this.rest.request<{mode:AccountMode}, MyAccountDto>({ method: 'POST', url: '/api/accounts/my-account/switch-mode', body: { mode } }, this.config); }
  enableMode(mode: AccountMode) { return this.rest.request<{mode:AccountMode}, MyAccountDto>({ method: 'POST', url: '/api/accounts/my-account/enable-mode', body: { mode } }, this.config); }
  acceptLegalDocuments(legalDocumentIds: string[]) { return this.rest.request<{legalDocumentIds:string[]}, MyAccountDto>({ method: 'POST', url: '/api/accounts/my-account/accept-legal-documents', body: { legalDocumentIds } }, this.config); }
  getConsents() { return this.rest.request<void, ListResultDto<ConsentStatusDto>>({ method: 'GET', url: '/api/accounts/my-account/consents' }, this.config); }
  updateConsent(type: ConsentType, granted: boolean) { return this.rest.request<{type:ConsentType;granted:boolean}, ConsentStatusDto>({ method: 'PUT', url: '/api/accounts/my-account/consent', body: { type, granted } }, this.config); }
}
