import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/ui/ui.components';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CardComponent],
  template: `
    <section class="relative grid min-h-[30rem] place-items-center overflow-hidden bg-primary px-4 text-center text-primary-foreground">
      <div class="absolute inset-0 opacity-20 [background:var(--hero-overlay)]"></div>
      <div class="relative max-w-3xl"><p class="mb-4 text-xs font-semibold uppercase tracking-[.35em]">Belleza cerca de ti</p><h1 class="font-display text-5xl leading-tight md:text-7xl">Tu belleza, tu estilo</h1><p class="mx-auto my-6 max-w-2xl text-lg opacity-80">Descubre y reserva con profesionales de belleza en República Dominicana.</p><a routerLink="/buscar" class="inline-flex min-h-12 items-center rounded-lg bg-primary-foreground px-7 font-semibold text-primary">Explorar servicios</a></div>
    </section>
    <section class="mx-auto max-w-7xl px-4 py-14"><p class="text-xs font-semibold uppercase tracking-[.25em] text-muted-foreground">Fundaciones listas</p><h2 class="font-display mt-2 text-3xl">Una experiencia creada para cada estilo</h2><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">@for(item of items;track item.title){<ob-card [interactive]="true"><div class="p-6"><span class="text-2xl" aria-hidden="true">{{item.icon}}</span><h3 class="mt-4 font-bold">{{item.title}}</h3><p class="mt-2 text-sm text-muted-foreground">{{item.text}}</p></div></ob-card>}</div></section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly items = [
    { icon: '✦', title: 'Talento verificado', text: 'Conecta con especialistas y descubre su trabajo.' },
    { icon: '◷', title: 'Reserva simple', text: 'Elige servicio, fecha y hora desde cualquier dispositivo.' },
    { icon: '♡', title: 'Comunidad', text: 'Guarda favoritos e inspírate con la red de belleza.' },
    { icon: '◇', title: 'Pago protegido', text: 'Una experiencia transparente de principio a fin.' },
  ];
}
