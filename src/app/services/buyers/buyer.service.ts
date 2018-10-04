import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { retry, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BuyersAggregate } from '../../models/buyers/buyersAggregate';
import { BuyersAggregateResponse } from "../../models/buyers/BuyersAggregateResponse";
import { BuyerResponseModel } from '../../models/buyers/buyerResponseModel';
import { RejectRequest } from '../../models/shared/rejectRequest';
import { ToastService } from '../../shared/services/toast/toast.service';
import { BuyerProductsRequest } from '../../models/buyers/buyerProductsRequest';

@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  constructor(private http: HttpClient, private toastService: ToastService) { }

  public getAllBuyers(): Observable<BuyersAggregateResponse> {
    let url = environment.serverUrl + environment.api_getBuyer;

    return this.http.get<BuyersAggregateResponse>( url, { headers: ServiceHelper.getAuthHeader() });;
  }

  public approveBuyer(id: string): Observable<BuyerResponseModel> {
    let url = environment.serverUrl + environment.api_approveBuyer + id;

    return this.http.get<BuyerResponseModel>( url, { headers: ServiceHelper.getAuthHeader() });
  }

  public rejectBuyer(rejectRequest: RejectRequest): Observable<BuyerResponseModel> {
    let url = environment.serverUrl + environment.api_rejectBuyer;

    return this.http.post<BuyerResponseModel>( url, rejectRequest, { headers: ServiceHelper.getAuthHeader() });
  }

  public updateProducts(model: BuyerProductsRequest): Observable<BuyerResponseModel> {
    let url = environment.serverUrl + environment.api_updateBuyerProduct;

    return this.http.post<BuyerResponseModel>( url, model, { headers: ServiceHelper.getAuthHeader() });
  }
}
