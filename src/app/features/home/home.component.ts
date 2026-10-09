import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, CardComponent, PriceComponent } from '../../shared/ui/ui.components';
import { PROFILES_API, Professional, Promotion } from '../discover/data/profiles.mock';
import { FEED_API, SocialPost } from '../social/data/social.mock';

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, BadgeComponent, CardComponent, PriceComponent],
  template: `
    <section class="hero">
      <img fill priority ngSrc="https://cdn.b12.io/client_media/kvKvc0V1/58d6f65e-9cc7-11f1-b027-0242ac110002-AKP71UMx-_9K5-GTo7k8-_dQMEBTqC.jpg" alt="Interior elegante de un salón de belleza" class="object-cover">
      <div class="overlay"></div>
      <div class="hero-copy"><p>Belleza cerca de ti</p><h1>Tu belleza, tu estilo</h1><span>Descubre los mejores profesionales de belleza en República Dominicana</span><a routerLink="/buscar">Explorar profesionales</a></div>
    </section>
    <div class="shell">
      <section class="block"><div class="heading"><div><p>Encuentra tu estilo</p><h2>Categorías</h2></div></div><div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">@for(category of categories();track category){<a routerLink="/buscar" [queryParams]="{category}" class="category"><span aria-hidden="true">✦</span><b>{{category}}</b></a>}</div></section>
      <section class="block"><div class="heading"><div><p>Solo por tiempo limitado</p><h2>Promociones activas</h2></div></div><div class="grid gap-4 md:grid-cols-2">@for(item of promotions();track item.id){<ob-card [interactive]="true"><div class="p-6"><ob-badge tone="metal">OFERTA</ob-badge><h3 class="mt-4 text-xl font-bold">{{item.title}}</h3><p class="mt-2 text-muted-foreground">{{item.detail}}</p><small class="mt-3 block">por {{item.professional}}</small></div></ob-card>}</div></section>
      <section class="block"><div class="heading"><div><p>Talento verificado</p><h2>Profesionales destacadas</h2></div><a routerLink="/buscar">Ver todas →</a></div><div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">@for(pro of professionals();track pro.id){<a [routerLink]="['/profesional',pro.id]" class="pro-card"><span class="relative block aspect-[4/5]"><img fill [ngSrc]="pro.image" [alt]="pro.name" class="object-cover"></span><div class="p-4"><div class="flex items-start justify-between gap-2"><div><h3 class="font-bold">{{pro.name}} @if(pro.verified){<span class="text-metal" title="Verificada">●</span>}</h3><p class="text-sm text-muted-foreground">{{pro.specialty}}</p></div><span class="font-semibold">★ {{pro.rating}}</span></div><div class="mt-4 flex justify-between text-sm"><span>{{pro.zone}}</span><b>Desde <ob-price [value]="pro.priceFrom"/></b></div></div></a>}</div></section>
      <section class="block"><div class="heading"><div><p>Inspírate</p><h2>Comunidad</h2></div><a routerLink="/social">Ver todas →</a></div><div class="grid gap-5 md:grid-cols-3">@for(post of posts();track post.id){<ob-card><div class="relative aspect-square"><img fill [ngSrc]="post.image" [alt]="'Trabajo de '+post.professional" class="object-cover"></div><div class="p-4"><b>{{post.professional}}</b><p class="my-2 text-sm">{{post.text}}</p><small class="text-muted-foreground">♡ {{post.likes}} · {{post.comments}} comentarios</small></div></ob-card>}</div></section>
    </div>
  `,
  styles: [`.hero{position:relative;display:grid;min-height:34rem;place-items:center;overflow:hidden}.overlay{position:absolute;inset:0;background:var(--hero-overlay)}.hero-copy{position:relative;z-index:1;max-width:52rem;padding:2rem 1rem;text-align:center;color:var(--hero-foreground)}.hero-copy p,.heading p{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.3em}.hero-copy h1{margin:.75rem 0;font-family:var(--font-display);font-size:clamp(3rem,8vw,5rem)}.hero-copy span{display:block;font-size:1.125rem}.hero-copy a{display:inline-flex;min-height:3rem;align-items:center;margin-top:2rem;border-radius:.5rem;background:var(--card);color:var(--card-foreground);padding:0 1.5rem;font-weight:700}.shell{max-width:80rem;margin:auto;padding:0 1rem}.block{padding:3.5rem 0}.heading{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1.5rem}.heading p{color:var(--muted-foreground)}.heading h2{margin-top:.35rem;font-family:var(--font-display);font-size:2rem}.heading a{min-height:2.75rem;font-weight:600}.category{display:grid;min-height:7rem;place-items:center;border:1px solid var(--border);border-radius:1rem;background:var(--card);padding:1rem;text-align:center;transition:.18s}.category:hover,.pro-card:hover{transform:translateY(-2px);border-color:var(--metal)}.category span{font-size:1.5rem}.pro-card{overflow:hidden;border:1px solid var(--border);border-radius:1rem;background:var(--card);transition:.18s}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly profilesApi=inject(PROFILES_API);private readonly feedApi=inject(FEED_API);
  readonly professionals=signal<Professional[]>([]);readonly categories=signal<string[]>([]);readonly promotions=signal<Promotion[]>([]);readonly posts=signal<SocialPost[]>([]);
  ngOnInit(){this.profilesApi.list().subscribe(v=>this.professionals.set(v));this.profilesApi.categories().subscribe(v=>this.categories.set(v));this.profilesApi.promotions().subscribe(v=>this.promotions.set(v));this.feedApi.list().subscribe(v=>this.posts.set(v.slice(0,3)))}
}
