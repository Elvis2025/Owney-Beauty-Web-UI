import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChildren, forwardRef, inject, input, output, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToasterService } from '@abp/ng.theme.shared';
import { ThemeMode, ThemeName, ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'ob-button',
  template: `<button [attr.type]="type()" [disabled]="disabled() || loading()" [class]="classes()"><ng-content />@if (loading()) { <span class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true"></span> }</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'>('primary');
  readonly size = input<'sm' | 'md' | 'lg' | 'icon'>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  classes() {
    const variants = { primary: 'bg-primary text-primary-foreground', secondary: 'bg-secondary text-secondary-foreground', outline: 'border border-border bg-card text-card-foreground hover:bg-accent', ghost: 'text-foreground hover:bg-accent', destructive: 'bg-destructive text-primary-foreground', link: 'text-primary underline-offset-4 hover:underline' };
    const sizes = { sm: 'min-h-11 px-3 text-sm', md: 'min-h-11 px-5', lg: 'min-h-12 px-7 text-lg', icon: 'size-11' };
    return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 ${variants[this.variant()]} ${sizes[this.size()]}`;
  }
}

abstract class BaseValueAccessor implements ControlValueAccessor {
  value = '';
  disabled = false;
  protected onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;
  writeValue(value: string | null) { this.value = value ?? ''; }
  registerOnChange(fn: (value: string) => void) { this.onChange = fn; }
  registerOnTouched(fn: () => void) { this.onTouched = fn; }
  setDisabledState(disabled: boolean) { this.disabled = disabled; }
  update(event: Event) { this.value = (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value; this.onChange(this.value); }
}

@Component({ selector: 'ob-input', providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true }], template: `<label class="grid gap-1.5 text-sm font-medium"><span>{{label()}}</span><span class="flex min-h-11 items-center rounded-lg border border-input bg-card focus-within:outline-2 focus-within:outline-ring">@if(prefix()){<span class="pl-3 text-muted-foreground">{{prefix()}}</span>}<input class="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none" [type]="type()" [value]="value" [disabled]="disabled" [attr.autocomplete]="autocomplete()" [attr.aria-invalid]="!!error()" (input)="update($event)" (blur)="onTouched()" />@if(suffix()){<span class="pr-3 text-muted-foreground">{{suffix()}}</span>}</span>@if(error()){<small class="text-destructive">{{error()}}</small>}@else if(help()){<small class="text-muted-foreground">{{help()}}</small>}</label>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class InputComponent extends BaseValueAccessor { readonly label=input(''); readonly type=input('text'); readonly autocomplete=input('off'); readonly help=input(''); readonly error=input(''); readonly prefix=input(''); readonly suffix=input(''); }

@Component({ selector: 'ob-textarea', providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaComponent), multi: true }], template: `<label class="grid gap-1.5 text-sm font-medium"><span>{{label()}}</span><textarea class="min-h-28 rounded-lg border border-input bg-card px-3 py-2.5 outline-none focus-visible:outline-2 focus-visible:outline-ring" [value]="value" [disabled]="disabled" [attr.aria-invalid]="!!error()" (input)="update($event)" (blur)="onTouched()"></textarea>@if(error()){<small class="text-destructive">{{error()}}</small>}</label>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class TextareaComponent extends BaseValueAccessor { readonly label=input(''); readonly error=input(''); }

@Component({ selector: 'ob-select', providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectComponent), multi: true }], template: `<label class="grid gap-1.5 text-sm font-medium"><span>{{label()}}</span><select class="min-h-11 rounded-lg border border-input bg-card px-3 py-2.5 outline-none focus-visible:outline-2 focus-visible:outline-ring" [value]="value" [disabled]="disabled" (change)="update($event)" (blur)="onTouched()"><ng-content /></select>@if(error()){<small class="text-destructive">{{error()}}</small>}</label>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class SelectComponent extends BaseValueAccessor { readonly label=input(''); readonly error=input(''); }

@Component({
  selector: 'ob-otp-input', imports: [FormsModule], providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OtpInputComponent), multi: true }],
  template: `<div class="flex gap-2" (paste)="paste($event)" role="group" aria-label="Código de verificación de seis dígitos">@for(digit of digits(); track $index){<input #digitInput class="size-11 rounded-lg border border-input bg-card text-center text-xl font-bold outline-none focus-visible:outline-2 focus-visible:outline-ring" inputmode="numeric" maxlength="1" [value]="digit" [disabled]="disabled" [attr.aria-label]="'Dígito ' + ($index + 1)" (input)="setDigit($index, $event)" (keydown.backspace)="backspace($index, $event)" />}</div>`, changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent extends BaseValueAccessor {
  @ViewChildren('digitInput') private fields!: { toArray(): ElementRef<HTMLInputElement>[] };
  readonly digits = signal(['', '', '', '', '', '']);
  override writeValue(value: string | null) { super.writeValue(value); this.digits.set((value ?? '').padEnd(6).slice(0, 6).split('').map(v => v.trim())); }
  setDigit(index: number, event: Event) { const value=(event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1); this.updateDigits(index, value); if(value) this.fields.toArray()[index + 1]?.nativeElement.focus(); }
  backspace(index: number, event: Event) { if(!this.digits()[index] && index > 0){ event.preventDefault(); this.fields.toArray()[index - 1].nativeElement.focus(); this.updateDigits(index - 1, ''); } }
  paste(event: ClipboardEvent) { const value=event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? ''; if(value){ event.preventDefault(); this.writeValue(value); this.onChange(value); this.fields.toArray()[Math.min(value.length, 5)]?.nativeElement.focus(); } }
  private updateDigits(index: number, value: string) { this.digits.update(items => items.map((item, i) => i === index ? value : item)); this.value=this.digits().join(''); this.onChange(this.value); }
}

@Component({ selector: 'ob-card', template: `<article [class]="interactive() ? 'rounded-xl border border-border bg-card text-card-foreground transition hover:-translate-y-0.5 hover:border-metal hover:shadow-lg' : 'rounded-xl border border-border bg-card text-card-foreground'"><ng-content /></article>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class CardComponent { readonly interactive=input(false); }

@Component({ selector: 'ob-badge, ob-status-chip', template: `<span [class]="classes()"><ng-content /></span>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class BadgeComponent { readonly tone=input<'neutral'|'success'|'warning'|'destructive'|'info'|'metal'>('neutral'); classes(){ const tones={neutral:'bg-muted text-muted-foreground',success:'bg-success/15 text-success',warning:'bg-warning/15 text-warning',destructive:'bg-destructive/15 text-destructive',info:'bg-info/15 text-info',metal:'bg-metal/20 text-foreground'}; return `inline-flex min-h-7 items-center rounded-full px-2.5 text-xs font-semibold ${tones[this.tone()]}`; } }

@Component({ selector: 'ob-avatar', imports:[NgOptimizedImage], template: `<span [class]="verified() ? 'relative inline-grid size-11 place-items-center overflow-hidden rounded-full bg-muted ring-2 ring-metal' : 'relative inline-grid size-11 place-items-center overflow-hidden rounded-full bg-muted'">@if(src()){<img fill [ngSrc]="src()" [alt]="alt()" class="object-cover" />}@else{<b>{{initials()}}</b>}</span>`, changeDetection: ChangeDetectionStrategy.OnPush })
export class AvatarComponent { readonly src=input(''); readonly alt=input('Avatar'); readonly name=input(''); readonly verified=input(false); initials(){return this.name().split(' ').slice(0,2).map(v=>v[0]).join('').toUpperCase();} }

@Component({ selector:'ob-rating', template:`<span class="inline-flex items-center gap-1" [attr.aria-label]="value() + ' de 5 estrellas'">@for(star of stars;track star){<button type="button" class="min-h-11 min-w-8 text-warning" [disabled]="readonly()" (click)="changed.emit(star)" [attr.aria-label]="star + ' estrellas'">{{star <= value() ? '★' : '☆'}}</button>}</span>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class RatingComponent { readonly value=input(0); readonly readonly=input(true); readonly changed=output<number>(); readonly stars=[1,2,3,4,5]; }

@Component({ selector:'ob-tabs, ob-segmented', template:`<div class="inline-flex rounded-lg bg-muted p-1" role="tablist"><ng-content /></div>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class TabsComponent {}

@Component({ selector:'ob-dialog, ob-sheet, ob-confirm', template:`<div class="fixed inset-0 z-50 grid place-items-end bg-foreground/40 p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true"><section class="max-h-[90vh] w-full max-w-lg overflow-auto rounded-t-xl border border-border bg-card p-6 text-card-foreground shadow-xl sm:rounded-xl"><ng-content /></section></div>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class DialogComponent {}

@Component({ selector:'ob-toast', template:`<div class="fixed right-4 top-4 z-[70]" aria-live="polite" aria-atomic="true"></div>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class ToastComponent { private readonly toaster=inject(ToasterService); protected readonly active=!!this.toaster; }

@Component({ selector:'ob-empty-state', template:`<section class="grid place-items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center"><span class="text-3xl" aria-hidden="true">{{icon()}}</span><h2 class="text-lg font-bold">{{title()}}</h2><p class="max-w-md text-sm text-muted-foreground">{{description()}}</p><ng-content /></section>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class EmptyStateComponent { readonly icon=input('◇'); readonly title=input('Sin resultados'); readonly description=input('Prueba con otros criterios.'); }

@Component({ selector:'ob-skeleton', template:`<span class="block animate-pulse rounded-lg bg-muted" [style.height]="height()"></span>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class SkeletonComponent { readonly height=input('1rem'); }

@Component({ selector:'ob-price', imports:[CurrencyPipe], template:`<span>{{value() | currency:currency():'symbol-narrow':'1.0-2':'es-DO'}}</span>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class PriceComponent { readonly value=input(0); readonly currency=input('DOP'); }

@Component({
  selector:'ob-theme-picker',
  template:`<fieldset class="grid gap-4"><legend class="mb-2 font-semibold">Tema visual</legend><div class="grid grid-cols-4 gap-3">@for(item of themeService.themes;track item.name){<button type="button" class="grid min-h-16 place-items-center gap-1 rounded-lg border border-border bg-card p-2 text-xs focus-visible:outline-2 focus-visible:outline-ring" [attr.aria-pressed]="themeService.theme()===item.name" (click)="selectTheme(item.name)"><span class="size-6 rounded-full ring-1 ring-border" [style.background]="item.swatch"></span>{{item.label}}</button>}</div><div class="grid grid-cols-3 gap-2" role="group" aria-label="Modo de color">@for(mode of modes;track mode.value){<button type="button" class="min-h-11 rounded-lg border border-border px-3 text-sm font-medium" [class.bg-primary]="themeService.mode()===mode.value" [class.text-primary-foreground]="themeService.mode()===mode.value" (click)="selectMode(mode.value)">{{mode.label}}</button>}</div></fieldset>`,
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent { readonly themeService=inject(ThemeService); readonly modes:readonly {value:ThemeMode;label:string}[]=[{value:'light',label:'Claro'},{value:'dark',label:'Oscuro'},{value:'system',label:'Sistema'}]; selectTheme(value:ThemeName){this.themeService.setTheme(value);} selectMode(value:ThemeMode){this.themeService.setMode(value);} }

@Component({ selector:'ob-bottom-nav', imports:[RouterLink,RouterLinkActive], template:`<nav class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Navegación principal"><a routerLink="/inicio" routerLinkActive="text-primary" class="grid min-h-16 place-items-center text-xs">⌂<span>Inicio</span></a><a routerLink="/buscar" routerLinkActive="text-primary" class="grid min-h-16 place-items-center text-xs">⌕<span>Buscar</span></a><a routerLink="/social" routerLinkActive="text-primary" class="grid min-h-16 place-items-center text-xs">＋<span>Comunidad</span></a><a routerLink="/citas" routerLinkActive="text-primary" class="grid min-h-16 place-items-center text-xs">◷<span>Citas</span></a><a routerLink="/cuenta" routerLinkActive="text-primary" class="grid min-h-16 place-items-center text-xs">○<span>Perfil</span></a></nav>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class BottomNavComponent {}

@Component({ selector:'ob-sidebar', template:`<aside class="hidden min-h-[calc(100dvh-4rem)] w-64 shrink-0 border-r border-border bg-card p-4 lg:block"><ng-content /></aside>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class SidebarComponent {}

@Component({ selector:'ob-header', imports:[RouterLink], template:`<header class="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur"><div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4"><a routerLink="/inicio" class="font-display text-xl tracking-[.18em]">OWNEY <small class="text-[.55em] text-metal">BEAUTY</small></a><ng-content /></div></header>`, changeDetection:ChangeDetectionStrategy.OnPush })
export class HeaderComponent {}
