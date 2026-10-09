import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector:'app-forbidden',imports:[RouterLink],template:`<main class="grid min-h-[70dvh] place-items-center px-4 text-center"><div><p class="text-6xl font-bold text-metal">403</p><h1 class="mt-4 text-3xl font-bold">Sin permiso</h1><p class="mt-2 text-muted-foreground">Tu cuenta no tiene autorización para abrir esta sección.</p><a routerLink="/inicio" class="mt-6 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground">Volver al inicio</a></div></main>`,changeDetection:ChangeDetectionStrategy.OnPush})
export class ForbiddenComponent{}
