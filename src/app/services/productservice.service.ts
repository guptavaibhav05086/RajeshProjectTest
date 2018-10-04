import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { observable, of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Product, ProductsData } from '../models/Product';
import { ProductResponse } from '../models/Response';
import { ManufacturerPriceMapping } from '../models/ManufacturerPriceMapping';
import { Zone } from '../models/Zone';
import { Subcategories } from '../models/Subcategories';
import { ProductType } from '../models/ProductType';
import { Brands } from '../models/Brands';
import { ServiceHelper } from './../shared/helper/service-helper'
import { ProductTypeResponseModel } from '../models/productType/productTypeResponseModel'
import { BrandResponseModel } from '../models/brand/brandResponseModel'

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {

  constructor(private _httpClient: HttpClient) { }

  getProducts(): Observable<ProductResponse> {
    let url = environment.serverUrl + environment.api_products;
    return this._httpClient.get<Response>(url, { headers: ServiceHelper.getAuthHeader() }).pipe(retry(3),
      catchError(this.handleError<any>("getManufacturerRegistrationForm")));
  }

  createProduct(productDetails: Product): Observable<ProductResponse> {
    let url = environment.serverUrl + environment.api_products + "/create";
    return this._httpClient
      .post<ProductResponse>(url,
        JSON.stringify(productDetails),
        { headers: ServiceHelper.getAuthHeader() })
      .pipe(catchError(this.handleError<any>('create seller proudct error')));;
  }

  updateProduct(productDetails: Product): Observable<ProductResponse> {
    let url = environment.serverUrl + environment.api_products + "/update";
    return this._httpClient
      .post<ProductResponse>(url,
        JSON.stringify(productDetails),
        { headers: ServiceHelper.getAuthHeader() })
      .pipe(catchError(this.handleError<any>('create seller proudct error')));;
  }

  getProductsByManufacturer(manufacturerId: string): Observable<ProductResponse> {
    let url = environment.serverUrl + environment.api_products + '/getProductsOfManucaturer/' + manufacturerId;
    return this._httpClient.get<ProductResponse>(url, { headers: ServiceHelper.getAuthHeader() });
  }

  public getProductCategoryByManufacturer(manufacturerId: string): Observable<ProductResponse> {
    let url = environment.serverUrl + environment.api_products + '/getCategoriesOfManucaturer/' + manufacturerId;
    return this._httpClient.get<ProductResponse>(url, { headers: ServiceHelper.getAuthHeader() });
  }

  public deleteProduct(_id: string): Observable<any> {
    let url = environment.serverUrl + environment.api_products + `/${_id}`;

    return this._httpClient.delete<any>( url, { headers: ServiceHelper.getAuthHeader() });
  }

  createProductType(name: string): Observable<ProductTypeResponseModel> {
    let url = environment.serverUrl + environment.api_productTypes + '/create';
    var param = {'name': name}
    return this._httpClient
      .post<ProductTypeResponseModel>(url,
        JSON.stringify(param),
        { headers: ServiceHelper.getAuthHeader() })
      .pipe(catchError(this.handleError<any>('create proudct type error')));;
  }

  createBrand(name: string): Observable<BrandResponseModel> {
    let url = environment.serverUrl + environment.api_brands + '/create';
    var param = {'name': name}
    return this._httpClient
      .post<BrandResponseModel>(url,
        JSON.stringify(param),
        { headers: ServiceHelper.getAuthHeader() })
      .pipe(catchError(this.handleError<any>('create proudct type error')));;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      alert(error.error.error_description);
      return of(error as T);
    };
  }

  getHeaders(): any {
    //this.Token =  localStorage.getItem("token");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + this.Token
      }

      )
    };
    return httpOptions;
  }

}
