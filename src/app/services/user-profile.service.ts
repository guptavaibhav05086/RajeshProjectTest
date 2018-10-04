import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpModule, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import {environment } from '../../environments/environment';
import { ServiceHelper } from '../shared/helper/service-helper';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  
  constructor(private http: HttpClient) { }

  getUserProfile(id):Observable<any>{
    return this.http.get(environment.serverUrl + 'admin/profile/'+ id, {headers: ServiceHelper.getAuthHeader()});
  }
  updateUserProfile(req):Observable<any>{
    return this.http.post(environment.serverUrl + 'admin/updateProfile/' , req , {headers: ServiceHelper.getAuthHeader()})
  }
  resetPassword(req):Observable<any>{
    return this.http.post(environment.serverUrl + 'admin/resetPassword' , req , {headers: ServiceHelper.getAuthHeader()})
  }

  forgotPassword(req):Observable<any>{
    return this.http.post(environment.serverUrl + 'forgotPassword' , req , {headers: ServiceHelper.getAuthHeader()})
  }
}
