import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpModule, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import {environment } from '../../environments/environment';
import { ServiceHelper } from '../shared/helper/service-helper';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardDetails():Observable<any>{
    return this.http.get(environment.serverUrl + 'api/dashboard', {headers: ServiceHelper.getAuthHeader()});
  }
}
