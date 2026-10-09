import { Routes } from '@angular/router';
import { authGuard, modeGuard, permissionGuard } from './core/auth/route.guards';
import { AccountMode } from './core/api-temp/accounts-api.service';

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
      { path: 'buscar', loadComponent: () => import('./features/discover/discover.component').then(m => m.DiscoverComponent) },
      { path: 'profesional/:id', loadComponent: () => import('./features/discover/discover.component').then(m => m.ProfessionalProfileComponent) },
      { path: 'social', canActivate:[authGuard], loadComponent: () => import('./features/social/social.component').then(m => m.SocialComponent) },
      { path: 'reservar/:professionalId/:serviceId', canActivate:[authGuard], loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingFlowComponent) },
      { path: 'citas', canActivate:[authGuard], loadComponent: () => import('./features/booking/booking.component').then(m => m.AppointmentsComponent) },
      { path: 'favoritos', canActivate:[authGuard], loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent) },
      { path: 'notificaciones', canActivate:[authGuard], loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent) },
      { path: 'cuenta', canActivate: [authGuard], loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
      { path: 'pro/panel', data:{mode:AccountMode.Professional}, canActivate:[authGuard,modeGuard], loadComponent:()=>import('./features/pro/pro-pages.component').then(m=>m.ProDashboardComponent) },
      { path: 'pro/agenda', data:{mode:AccountMode.Professional}, canActivate:[authGuard,modeGuard], loadComponent:()=>import('./features/pro/pro-pages.component').then(m=>m.ProAgendaComponent) },
      { path: 'pro/servicios', data:{mode:AccountMode.Professional}, canActivate:[authGuard,modeGuard], loadComponent:()=>import('./features/pro/pro-pages.component').then(m=>m.ProServicesComponent) },
      { path: 'pro/promociones', data:{mode:AccountMode.Professional}, canActivate:[authGuard,modeGuard], loadComponent:()=>import('./features/pro/pro-pages.component').then(m=>m.ProPromotionsComponent) },
      { path: 'pro/perfil', data:{mode:AccountMode.Professional}, canActivate:[authGuard,modeGuard], loadComponent:()=>import('./features/pro/pro-pages.component').then(m=>m.ProProfileComponent) },
      { path: 'admin', data:{permission:'Platform.Geography.Manage'}, canActivate:[authGuard,permissionGuard], loadComponent:()=>import('./features/admin/admin-dashboard.component').then(m=>m.AdminDashboardComponent) },
      { path: 'admin/geografia', data:{permission:'Platform.Geography.Manage'}, canActivate:[authGuard,permissionGuard], loadComponent:()=>import('./features/admin/geography-admin.component').then(m=>m.GeographyAdminComponent) },
      { path: 'admin/monedas', data:{permission:'Platform.Currencies.Manage'}, canActivate:[authGuard,permissionGuard], loadComponent:()=>import('./features/admin/currency-admin.component').then(m=>m.CurrencyAdminComponent) },
      { path: 'admin/impuestos', data:{permission:'Platform.TaxRates.Manage'}, canActivate:[authGuard,permissionGuard], loadComponent:()=>import('./features/admin/tax-admin.component').then(m=>m.TaxAdminComponent) },
      { path: 'admin/legal', data:{permission:'Accounts.LegalDocuments.Manage'}, canActivate:[authGuard,permissionGuard], loadComponent:()=>import('./features/admin/legal-admin.component').then(m=>m.LegalAdminComponent) },
      { path: 'admin/auditoria', data:{permission:'Platform.BusinessAudit.View'}, canActivate:[authGuard,permissionGuard], loadComponent:()=>import('./features/admin/audit-admin.component').then(m=>m.AuditAdminComponent) },
      { path: 'sin-permiso', loadComponent:()=>import('./features/admin/forbidden.component').then(m=>m.ForbiddenComponent) },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
