import { Injectable, inject } from '@angular/core';
import { RestService } from '@abp/ng.core';

// TODO: reemplazar por proxy generado
export interface PagedResultDto<T>{items:T[];totalCount:number}
export interface ProvinceDto{id:string;countryCode:string;code:string;name:string;isActive:boolean;creationTime:string}
export interface CreateUpdateProvinceDto{code:string;name:string;isActive:boolean}
export interface MunicipalityDto{id:string;provinceId:string;code:string;name:string;isActive:boolean;creationTime:string}
export interface CreateUpdateMunicipalityDto{provinceId:string;code:string;name:string;isActive:boolean}
export interface CurrencyDto{id:string;code:string;name:string;symbol:string;decimalPlaces:number;isDefault:boolean;isActive:boolean}
export interface CreateCurrencyDto{code:string;name:string;symbol:string;decimalPlaces:number}
export interface UpdateCurrencyDto{name:string;symbol:string;decimalPlaces:number;isActive:boolean}
export interface TaxRateDto{id:string;countryCode:string;code:string;name:string;rate:number;effectiveFrom:string;effectiveTo?:string;isActive:boolean}
export interface CreateTaxRateDto{countryCode:string;code:string;name:string;rate:number;effectiveFrom:string;effectiveTo?:string}
export interface UpdateTaxRateDto{name:string;rate:number;effectiveFrom:string;effectiveTo?:string;isActive:boolean}
export interface BusinessAuditEventDto{id:string;module:string;action:string;entityType:string;entityId?:string;succeeded:boolean;reason?:string;dataJson?:string;userId?:string;userName?:string;clientIpAddress?:string;correlationId?:string;creationTime:string}

@Injectable({providedIn:'root'})
export class PlatformApiService{
  private readonly rest=inject(RestService);private readonly config={apiName:'default'};
  getPublicProvinces(){return this.rest.request<void,{items:ProvinceDto[]}>({method:'GET',url:'/api/platform/geography/provinces'},this.config)}
  getPublicMunicipalities(provinceId:string){return this.rest.request<void,{items:MunicipalityDto[]}>({method:'GET',url:`/api/platform/geography/municipalities/${provinceId}`},this.config)}
  getActiveCurrencies(){return this.rest.request<void,{items:CurrencyDto[]}>({method:'GET',url:'/api/platform/currency/active'},this.config)}
  getProvinces(params:Record<string,unknown>={}){return this.rest.request<void,PagedResultDto<ProvinceDto>>({method:'GET',url:'/api/platform/province',params},this.config)}
  createProvince(input:CreateUpdateProvinceDto){return this.rest.request<CreateUpdateProvinceDto,ProvinceDto>({method:'POST',url:'/api/platform/province',body:input},this.config)}
  updateProvince(id:string,input:CreateUpdateProvinceDto){return this.rest.request<CreateUpdateProvinceDto,ProvinceDto>({method:'PUT',url:`/api/platform/province/${id}`,body:input},this.config)}
  getMunicipalities(params:Record<string,unknown>={}){return this.rest.request<void,PagedResultDto<MunicipalityDto>>({method:'GET',url:'/api/platform/municipality',params},this.config)}
  createMunicipality(input:CreateUpdateMunicipalityDto){return this.rest.request<CreateUpdateMunicipalityDto,MunicipalityDto>({method:'POST',url:'/api/platform/municipality',body:input},this.config)}
  updateMunicipality(id:string,input:CreateUpdateMunicipalityDto){return this.rest.request<CreateUpdateMunicipalityDto,MunicipalityDto>({method:'PUT',url:`/api/platform/municipality/${id}`,body:input},this.config)}
  getCurrencies(){return this.rest.request<void,{items:CurrencyDto[]}>({method:'GET',url:'/api/platform/currency'},this.config)}
  createCurrency(input:CreateCurrencyDto){return this.rest.request<CreateCurrencyDto,CurrencyDto>({method:'POST',url:'/api/platform/currency',body:input},this.config)}
  updateCurrency(id:string,input:UpdateCurrencyDto){return this.rest.request<UpdateCurrencyDto,CurrencyDto>({method:'PUT',url:`/api/platform/currency/${id}`,body:input},this.config)}
  setDefaultCurrency(id:string){return this.rest.request<void,CurrencyDto>({method:'POST',url:`/api/platform/currency/${id}/set-default`},this.config)}
  getTaxRates(params:Record<string,unknown>={}){return this.rest.request<void,PagedResultDto<TaxRateDto>>({method:'GET',url:'/api/platform/tax-rate',params},this.config)}
  createTaxRate(input:CreateTaxRateDto){return this.rest.request<CreateTaxRateDto,TaxRateDto>({method:'POST',url:'/api/platform/tax-rate',body:input},this.config)}
  updateTaxRate(id:string,input:UpdateTaxRateDto){return this.rest.request<UpdateTaxRateDto,TaxRateDto>({method:'PUT',url:`/api/platform/tax-rate/${id}`,body:input},this.config)}
  getBusinessAuditEvents(params:Record<string,unknown>={}){return this.rest.request<void,PagedResultDto<BusinessAuditEventDto>>({method:'GET',url:'/api/platform/business-audit-event',params},this.config)}
}
