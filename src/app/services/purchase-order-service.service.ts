import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpModule, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import {environment } from '../../environments/environment';
import { ServiceHelper } from '../shared/helper/service-helper';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderServiceService {

  constructor(private http: HttpClient) { }

  getOrder(): Observable<any>{
    let url = environment.serverUrl + 'orders';
    return this.http.get(url, {headers: ServiceHelper.getAuthHeader()});
  }

  getOrderDetails(orderId): Observable<any>{     
    return this.http.get(environment.serverUrl + 'orders/'+ orderId, {headers: ServiceHelper.getAuthHeader()});
  }

  updateOrderStatus( orderStatus, orderId): Observable<any>{
    let params = {
      "_id": orderId,
      "status": orderStatus
    }; 
    return this.http.post(environment.serverUrl + 'orders/updateStatus' , params, {headers: ServiceHelper.getAuthHeader()})
  }

  rejectOrder(orderId:string, rejectReason:string) : any{
    let params =  {
        "_id": orderId,
        "rejectReason": rejectReason
      }
      return this.http.post(environment.serverUrl + 'orders/reject', params, {headers: ServiceHelper.getAuthHeader()})
  }

  updateRemarks(params): Observable<any>{
    return this.http.post(environment.serverUrl + 'orders/updateRemarks', params, {headers: ServiceHelper.getAuthHeader()})
  }

  getLocations(): Observable<any>{
    let url = environment.serverUrl + 'api/'+ environment.api_Location;
    return this.http.get(url, {headers: ServiceHelper.getAuthHeader()});
  }

  
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

 approve(orderId):any{
   return this.http.get(environment.serverUrl + 'orders/approve/' + orderId, {headers: ServiceHelper.getAuthHeader()})
 }
}
