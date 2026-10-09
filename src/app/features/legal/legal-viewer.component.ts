import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AccountsApiService, LegalDocumentType, PublicLegalDocumentDto } from '../../core/api-temp/accounts-api.service';
import { EmptyStateComponent, SkeletonComponent } from '../../shared/ui/ui.components';

@Component({
  selector:'app-legal-viewer', imports:[RouterLink,EmptyStateComponent,SkeletonComponent],
  template:`<section class="mx-auto max-w-3xl px-4 py-12"><a routerLink="/inicio" class="font-display tracking-[.18em]">OWNEY BEAUTY</a>@if(loading()){<div class="mt-10 grid gap-4"><ob-skeleton height="3rem"/><ob-skeleton height="18rem"/></div>}@else if(document();as doc){<article class="mt-10"><p class="text-xs font-semibold uppercase tracking-[.25em] text-muted-foreground">Documento legal · Versión {{doc.version}}</p><h1 class="mt-3 text-4xl font-bold">{{doc.title}}</h1>@if(doc.content){<div class="mt-8 whitespace-pre-wrap leading-8">{{doc.content}}</div>}@if(doc.externalUrl){<a class="mt-8 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground" [href]="doc.externalUrl" target="_blank" rel="noopener">Abrir documento oficial</a>}</article>}@else{<ob-empty-state class="mt-10" title="Documento no disponible" description="No encontramos una versión vigente en este momento."/>}</section>`,
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class LegalViewerComponent implements OnInit {
  private readonly api=inject(AccountsApiService);private readonly route=inject(ActivatedRoute);readonly loading=signal(true);readonly document=signal<PublicLegalDocumentDto|null>(null);
  ngOnInit(){const type=Number(this.route.snapshot.paramMap.get('type')) as LegalDocumentType;this.api.getCurrentLegalDocuments('es').pipe(finalize(()=>this.loading.set(false))).subscribe({next:r=>this.document.set(r.items.find(item=>item.type===type)??null)})}
}
