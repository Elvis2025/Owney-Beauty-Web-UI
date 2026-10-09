import { InjectionToken, Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BeautyService } from '../../discover/data/profiles.mock';

export type AppointmentStatus='Confirmada'|'Pendiente'|'En curso'|'Completada'|'Cancelada'|'Reembolsada';
export interface Appointment{id:string;date:string;time:string;service:string;professional:string;status:AppointmentStatus;price:number}
export interface BookingDraft{professionalId:string;service:BeautyService;date:string;time:string;modality:'Salón'|'A domicilio';address?:string;notes?:string;travelFee:number;discount:number}
export interface BookingApi{slots(date:string):Observable<string[]>;create(input:BookingDraft):Observable<Appointment>;list():Observable<Appointment[]>;cancel(id:string,reason:string):Observable<Appointment>}
export interface CatalogApi{featuredServices():Observable<BeautyService[]>}
export interface PaymentsApi{pay(appointmentId:string):Observable<{approved:boolean;reference:string}>}
export interface ReviewsApi{create(appointmentId:string,rating:number,comment:string):Observable<void>}

@Injectable({providedIn:'root'})export class MockBookingApi implements BookingApi{private readonly appointments:Appointment[]=[{id:'a1',date:'2026-10-12',time:'11:00 AM',service:'Manicure en gel',professional:'María Rodríguez',status:'Confirmada',price:1200},{id:'a2',date:'2026-10-14',time:'3:30 PM',service:'Maquillaje social',professional:'Laura Díaz',status:'Pendiente',price:3200},{id:'a3',date:'2026-09-20',time:'10:00 AM',service:'Facial luminosidad',professional:'Carmen López',status:'Completada',price:2800}];slots(date:string){return of(date.endsWith('0')?[]:['9:00 AM','10:30 AM','1:00 PM','3:30 PM','5:00 PM'])}create(input:BookingDraft){const item={id:crypto.randomUUID(),date:input.date,time:input.time,service:input.service.name,professional:'Profesional Owney',status:'Confirmada' as const,price:input.service.price+input.travelFee-input.discount};this.appointments.unshift(item);return of(item)}list(){return of(this.appointments)}cancel(id:string,reason:string){void reason;const item=this.appointments.find(a=>a.id===id)!;item.status='Reembolsada';return of(item)}}
@Injectable({providedIn:'root'})export class MockCatalogApi implements CatalogApi{featuredServices(){return of([])}}
@Injectable({providedIn:'root'})export class MockPaymentsApi implements PaymentsApi{pay(appointmentId:string){return of({approved:true,reference:`OB-${appointmentId.slice(0,8)}`})}}
@Injectable({providedIn:'root'})export class MockReviewsApi implements ReviewsApi{create(appointmentId:string,rating:number,comment:string){void appointmentId;void rating;void comment;return of(undefined)}}
export const BOOKING_API=new InjectionToken<BookingApi>('BookingApi',{providedIn:'root',factory:()=>inject(MockBookingApi)});export const CATALOG_API=new InjectionToken<CatalogApi>('CatalogApi',{providedIn:'root',factory:()=>inject(MockCatalogApi)});export const PAYMENTS_API=new InjectionToken<PaymentsApi>('PaymentsApi',{providedIn:'root',factory:()=>inject(MockPaymentsApi)});export const REVIEWS_API=new InjectionToken<ReviewsApi>('ReviewsApi',{providedIn:'root',factory:()=>inject(MockReviewsApi)});
