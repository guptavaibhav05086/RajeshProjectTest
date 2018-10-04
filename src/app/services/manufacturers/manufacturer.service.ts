import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManufacturerAggregateResponse } from '../../models/manufacturers/manufacturersAggregateResponse';
import { environment } from '../../../environments/environment';
import { Observable, of } from '../../../../node_modules/rxjs';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { catchError } from '../../../../node_modules/rxjs/operators';
import { ManufacturerResponseModel } from '../../models/manufacturers/manufacturerResponseModel';
import { RejectRequest } from '../../models/shared/rejectRequest';
import { ManufacturersWithCategoriesResponse } from '../../models/manufacturers/manufacturersWithCategoriesResponse';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private http: HttpClient) { }

  public getAllManufacturers(): Observable<ManufacturerAggregateResponse> {
    let url = environment.serverUrl + environment.api_getManufacturer;

    return this.http.get<ManufacturerAggregateResponse>( url, { headers: ServiceHelper.getAuthHeader() });
  }

  public getAllManufacturersWithCategories(): Observable<ManufacturersWithCategoriesResponse> {
    let url = environment.serverUrl + environment.api_getManufacturersWithCategories;

    return this.http.get<ManufacturersWithCategoriesResponse>( url, { headers: ServiceHelper.getAuthHeader() });
  }

  public approveManufacturer(id: string): Observable<ManufacturerResponseModel> {
    let url = environment.serverUrl + environment.api_approveManufacturer + id;

    return this.http.get<ManufacturerResponseModel>( url, { headers: ServiceHelper.getAuthHeader() });
  }

  public rejectManufacturer(rejectRequest: RejectRequest): Observable<ManufacturerResponseModel> {
    let url = environment.serverUrl + environment.api_rejectManufacturer;

    return this.http.post<ManufacturerResponseModel>( url, rejectRequest, { headers: ServiceHelper.getAuthHeader() });
  }
}
