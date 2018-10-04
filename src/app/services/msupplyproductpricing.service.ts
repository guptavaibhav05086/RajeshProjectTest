import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders } from '@angular/common/http' ;
import {environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { observable,of} from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../models/Product';
import {ManufacturerPriceMapping } from '../models/ManufacturerPriceMapping';
import {Zone } from '../models/Zone';
import {Subcategories } from '../models/Subcategories';
import { ProductType} from '../models/ProductType';
import { Brands } from '../models/Brands';
import { ServiceHelper} from '../shared/helper/service-helper'


@Injectable({
  providedIn: 'root'
})
export class MsupplyproductpricingService {

  constructor(private _httpClient:HttpClient) { }

getProductPrice(pricingId:string):Observable<any>{
   let url = environment.serverUrl + environment.api_productPricing + "/" + pricingId;
   return this._httpClient.get<any[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
getProductPriceBuyer(pricingId:string):Observable<any>{
  let url = environment.serverUrl + environment.api_getProductPricingBuyer + "/" + pricingId;
  return this._httpClient.get<any[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
getViewHistory(pricingId:string,zoneId:string):Observable<any>{
  //debugger;
  let params = {
    _id:pricingId,
    zoneId:zoneId
  }
  let url = environment.serverUrl + environment.api_getViewHistory;
  //debugger;
  
  return this._httpClient.post<any>(url,params,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
getViewHistoryBuyer(pricingId:string,zoneId:string):Observable<any>{
  //debugger;
  let params = {
    _id:pricingId,
    zoneId:zoneId
  }
  let url = environment.serverUrl + environment.api_getViewHistoryBuyer;
  //debugger;
  
  return this._httpClient.post<any>(url,params,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
  /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getProducts():Observable<any>{
  debugger;
  let url = environment.serverUrl + environment.api_products;
  debugger;
  return this._httpClient.get<any>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}

/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getProductsPricing():Observable< ManufacturerPriceMapping[]>{
  let url = environment.serverUrl + environment.api_productPricing;
  return this._httpClient.get<ManufacturerPriceMapping[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}

/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getProductsPricingBuyer():Observable< ManufacturerPriceMapping[]>{
  let url = environment.serverUrl + environment.api_getProductPricingBuyer;
  return this._httpClient.get<ManufacturerPriceMapping[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}

/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getZones():Observable<Zone[]>{
  let url = environment.serverUrl + environment.api_pricingZone;
  return this._httpClient.get<Zone[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getSubcategories():Observable<Subcategories[]>{
  let url = environment.serverUrl + environment.api_subcategories;
  return this._httpClient.get<Subcategories[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getManufacturers():Observable<any>{
  let url = environment.serverUrl + environment.api_manufacturers;
  return this._httpClient.get<any[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
public getAllManufacturersWithCategories(): Observable<any> {
  let url = environment.serverUrl + environment.api_getManufacturersWithCategories;

  return this._httpClient.get<any>( url, { headers: ServiceHelper.getAuthHeader() });
}
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getBrands():Observable<Brands[]>{
  let url = environment.serverUrl + environment.api_brands;
  return this._httpClient.get<Brands[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getProductTypes():Observable<ProductType[]>{
  let url = environment.serverUrl + environment.api_productTypes;
  return this._httpClient.get<ProductType[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3));
}
createManufacturerPricingZone(prodPricing : ManufacturerPriceMapping):Observable<any>{
  let url = environment.serverUrl + environment.api_createProductPricing;
  return this._httpClient
      .post<any>(url,
       prodPricing
        ,{ headers: ServiceHelper.getAuthHeader() });
}

updateManufacturerPricingZone(prodPricing:ManufacturerPriceMapping):Observable<any>{
  let url = environment.serverUrl + environment.api_updateProductPricing;
  return this._httpClient
      .post<any>(url,
        prodPricing
        ,{ headers: ServiceHelper.getAuthHeader() });
}

createBuyerPricingZone(prodPricing : ManufacturerPriceMapping):Observable<any>{
  let url = environment.serverUrl + environment.api_createProductPricingBuyer;
  return this._httpClient
      .post<any>(url,
        prodPricing,{ headers: ServiceHelper.getAuthHeader() });
}

updateBuyerPricingZone(prodPricing:ManufacturerPriceMapping):Observable<any>{
  let url = environment.serverUrl + environment.api_updateProductPricingBuyer;
  return this._httpClient
      .post<any>(url,
        prodPricing,{ headers: ServiceHelper.getAuthHeader() }
        );
}

/**
 * Comment for method getHeaders.
 * @param Void  Need to be deleted.
 * @returns       Comment for return value.
 */
getHeaders():any{
  //this.Token =  localStorage.getItem("token");
  
  const httpOptions = {
      headers: new HttpHeaders({ 
          'Content-Type': 'application/json' ,
          // 'Authorization': 'Bearer ' + this.Token
      }
      
  )
  };
  return httpOptions;
}
/**
 * Comment for method handleError.
 * @param operation   operation name which created this error .
 * @param result   optional parameter to get error data from service.
 * @returns  obseravable for companyDetails Type.
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
     console.error(error);
     alert('Error Raised While connnecting to server.Please check your connection');
     return of (error as T);
   };
 }
}
