import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment } from '../../environments/environment';
import { ServiceHelper } from '../shared/helper/service-helper';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  _id: string;

  constructor(private http: HttpClient) { }

  getAllAdmin():Observable<any>{
    return this.http.get(environment.serverUrl + 'admin', {headers: ServiceHelper.getAuthHeader()});
  }

  getPermissions():Observable<any>{
    return this.http.get(environment.serverUrl + 'admin/permissions', {headers: ServiceHelper.getAuthHeader()})
  }

  createNewUser(req):Observable<any>{
    return this.http.post(environment.serverUrl + 'signup' , req, {headers: ServiceHelper.getAuthHeader()})
  }

  public updateProfile(req) : Observable<any> {
    return this.http.post(environment.serverUrl + 'admin/updateProfile' , req, {headers: ServiceHelper.getAuthHeader()})
  }

  setUserId(id){
    this._id = id;
  }
  getUserId(){
    return this._id;
  }
  
}
