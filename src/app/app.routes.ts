import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth/login', loadComponent: () => import('./features/auth/auth-pages.component').then(m => m.LoginPageComponent) },
  { path: 'auth/registro', loadComponent: () => import('./features/auth/auth-pages.component').then(m => m.RegisterPageComponent) },
  { path: 'auth/verificar-correo', data: { channel: 'correo' }, loadComponent: () => import('./features/auth/auth-pages.component').then(m => m.VerifyContactPageComponent) },
  { path: 'auth/verificar-telefono', data: { channel: 'teléfono' }, loadComponent: () => import('./features/auth/auth-pages.component').then(m => m.VerifyContactPageComponent) },
  { path: 'auth/recuperar', loadComponent: () => import('./features/auth/auth-pages.component').then(m => m.ForgotPasswordPageComponent) },
  { path: 'account/reset-password', loadComponent: () => import('./features/auth/auth-pages.component').then(m => m.ResetPasswordPageComponent) },
  { path: 'legal/:type', loadComponent: () => import('./features/legal/legal-viewer.component').then(m => m.LegalViewerComponent) },
  {
    path: '',
    loadComponent: () => import('./core/layout/app-shell.component').then(m => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
