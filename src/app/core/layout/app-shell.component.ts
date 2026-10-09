import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, PermissionService } from '@abp/ng.core';
import { AccountStore } from '../auth/account.store';
import { BottomNavComponent, HeaderComponent, SidebarComponent, ThemePickerComponent } from '../../shared/ui/ui.components';
import { AccountMode } from '../api-temp/accounts-api.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, BottomNavComponent, SidebarComponent, ThemePickerComponent],
  template: `
    <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground" href="#main-content">Saltar al contenido</a>
    <ob-header>
      <nav class="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
        @for (item of activeNavigation(); track item.path) {
          <a [routerLink]="item.path" routerLinkActive="bg-accent" class="grid min-h-11 place-items-center rounded-lg px-3 text-sm font-medium hover:bg-accent">{{ item.label }}</a>
        }
      </nav>
      <div class="flex items-center gap-1">
        @if (auth.isAuthenticated) { <a routerLink="/notificaciones" class="relative grid size-11 place-items-center rounded-lg hover:bg-accent" aria-label="Notificaciones">♢<span class="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive"></span></a> }
        <button type="button" class="grid size-11 place-items-center rounded-lg hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring" aria-label="Cambiar apariencia" (click)="themeOpen.set(!themeOpen())">◐</button>
        @if (auth.isAuthenticated) {
          @if (hasAdminAccess()) { <a routerLink="/admin/geografia" class="hidden min-h-11 place-items-center rounded-lg px-3 text-sm font-semibold hover:bg-accent sm:grid">Administrar</a> }
          <a routerLink="/cuenta" class="grid min-h-11 place-items-center rounded-lg px-3 text-sm font-semibold hover:bg-accent">Mi cuenta</a>
          <button type="button" class="grid size-11 place-items-center rounded-lg hover:bg-accent" aria-label="Cerrar sesión" (click)="logout()">↪</button>
        } @else {
          <a routerLink="/auth/login" class="grid min-h-11 place-items-center rounded-lg px-3 text-sm font-semibold hover:bg-accent">Entrar</a>
        }
      </div>
    </ob-header>
    @if (themeOpen()) {
      <div class="fixed inset-0 z-50 bg-foreground/40" (click)="themeOpen.set(false)">
        <section class="absolute right-0 top-0 h-full w-full max-w-md overflow-auto border-l border-border bg-card p-6 text-card-foreground shadow-xl" role="dialog" aria-modal="true" aria-label="Apariencia" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-center justify-between"><h2 class="text-xl font-bold">Apariencia</h2><button type="button" class="size-11 rounded-lg hover:bg-accent" aria-label="Cerrar" (click)="themeOpen.set(false)">×</button></div>
          <ob-theme-picker />
        </section>
      </div>
    }
    <div class="flex">
      @if (isAdminRoute() || store.activeMode() === modes.Professional) {
        <ob-sidebar><nav class="grid gap-1">@for(item of sidebarNavigation();track item.path){@if(!item.permission || permission.getGrantedPolicy(item.permission)){<a [routerLink]="item.path" routerLinkActive="bg-accent" class="grid min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-accent">{{item.label}}</a>}}</nav></ob-sidebar>
      }
      <main id="main-content" class="min-h-[calc(100dvh-4rem)] min-w-0 flex-1 pb-20 md:pb-0"><router-outlet /></main>
    </div>
    @if (store.pendingLegal().length) {
      <div class="fixed inset-0 z-[60] grid place-items-center bg-foreground/50 p-4">
        <section class="max-h-[90vh] w-full max-w-xl overflow-auto rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl" role="alertdialog" aria-modal="true" aria-labelledby="pending-legal-title">
          <p class="text-xs font-semibold uppercase tracking-[.25em] text-muted-foreground">Actualización legal</p><h2 id="pending-legal-title" class="mt-2 text-2xl font-bold">Revisa los documentos pendientes</h2><p class="mt-2 text-muted-foreground">Para seguir usando Owney Beauty debes aceptar las versiones vigentes.</p>
          <div class="my-5 grid gap-3">@for(doc of store.pendingLegal();track doc.id){<details class="rounded-lg border border-border p-4"><summary class="min-h-11 cursor-pointer font-semibold">{{doc.title}} · v{{doc.version}}</summary>@if(doc.content){<div class="whitespace-pre-wrap pt-3 text-sm leading-6">{{doc.content}}</div>}@if(doc.externalUrl){<a class="mt-3 inline-flex min-h-11 items-center underline" [href]="doc.externalUrl" target="_blank" rel="noopener">Abrir documento</a>}</details>}</div>
          <button type="button" class="min-h-11 w-full rounded-lg bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-50" [disabled]="store.loading()" (click)="acceptPending()">Aceptar y continuar</button>
        </section>
      </div>
    }
    <ob-bottom-nav />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  readonly auth = inject(AuthService);
  readonly store = inject(AccountStore);
  readonly permission = inject(PermissionService);
  private readonly router = inject(Router);
  readonly modes=AccountMode;
  readonly themeOpen = signal(false);
  readonly clientNavigation = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Buscar', path: '/buscar' },
    { label: 'Social', path: '/social' },
    { label: 'Citas', path: '/citas' },
    { label: 'Mi panel', path: '/cuenta' },
  ];
  readonly proNavigation=[{label:'Mi panel',path:'/pro/panel',permission:undefined},{label:'Agenda',path:'/pro/agenda',permission:undefined},{label:'Servicios',path:'/pro/servicios',permission:undefined},{label:'Promociones',path:'/pro/promociones',permission:undefined}];
  readonly adminNavigation=[{label:'Panel',path:'/admin',permission:'Platform.Geography.Manage'},{label:'Geografía',path:'/admin/geografia',permission:'Platform.Geography.Manage'},{label:'Monedas',path:'/admin/monedas',permission:'Platform.Currencies.Manage'},{label:'Impuestos',path:'/admin/impuestos',permission:'Platform.TaxRates.Manage'},{label:'Legal',path:'/admin/legal',permission:'Accounts.LegalDocuments.Manage'},{label:'Auditoría',path:'/admin/auditoria',permission:'Platform.BusinessAudit.View'}];
  constructor(){if(this.auth.isAuthenticated)this.store.load().subscribe();}
  acceptPending(){this.store.acceptPending().subscribe();}
  logout(){this.auth.logout().subscribe();}
  hasAdminAccess(){return ['Platform.Geography.Manage','Platform.Currencies.Manage','Platform.TaxRates.Manage','Accounts.LegalDocuments.Manage','Platform.BusinessAudit.View'].some(policy=>this.permission.getGrantedPolicy(policy));}
  activeNavigation(){return this.store.activeMode()===AccountMode.Professional?this.proNavigation:this.clientNavigation;}
  isAdminRoute(){return this.router.url.startsWith('/admin');}
  sidebarNavigation(){return this.isAdminRoute()?this.adminNavigation:this.proNavigation;}
}
