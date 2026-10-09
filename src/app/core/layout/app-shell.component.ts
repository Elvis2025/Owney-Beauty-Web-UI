import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@abp/ng.core';
import { BottomNavComponent, HeaderComponent, ThemePickerComponent } from '../../shared/ui/ui.components';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, BottomNavComponent, ThemePickerComponent],
  template: `
    <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground" href="#main-content">Saltar al contenido</a>
    <ob-header>
      <nav class="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
        @for (item of navigation; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="bg-accent" class="grid min-h-11 place-items-center rounded-lg px-3 text-sm font-medium hover:bg-accent">{{ item.label }}</a>
        }
      </nav>
      <div class="flex items-center gap-1">
        <button type="button" class="grid size-11 place-items-center rounded-lg hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring" aria-label="Cambiar apariencia" (click)="themeOpen.set(!themeOpen())">◐</button>
        @if (auth.isAuthenticated) {
          <a routerLink="/cuenta" class="grid min-h-11 place-items-center rounded-lg px-3 text-sm font-semibold hover:bg-accent">Mi cuenta</a>
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
    <main id="main-content" class="min-h-[calc(100dvh-4rem)] pb-20 md:pb-0"><router-outlet /></main>
    <ob-bottom-nav />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  readonly auth = inject(AuthService);
  readonly themeOpen = signal(false);
  readonly navigation = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Buscar', path: '/buscar' },
    { label: 'Social', path: '/social' },
    { label: 'Citas', path: '/citas' },
  ];
}
