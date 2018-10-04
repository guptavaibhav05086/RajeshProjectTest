import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PricingZonesResponse } from '../../models/pricing/pricingZonesResponse';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { PricingZone } from '../../models/pricing/PricingZone';
import { PricingZoneResponse } from '../../models/pricing/pricingZoneResponse';

@Injectable({
  providedIn: 'root'
})
export class PricingZoneService {

  constructor(private http: HttpClient) { }

  public getAllPricingZones(): Observable<PricingZonesResponse> {
    let url = environment.serverUrl + environment.api_pricingZone;

    return this.http.get<PricingZonesResponse>( url, { headers: ServiceHelper.getAuthHeader() });
  }

  public deletePricingZone(_id: string): Observable<any> {
    let url = environment.serverUrl + environment.api_pricingZone + `/${_id}`;

    return this.http.delete<any>( url, { headers: ServiceHelper.getAuthHeader() });
  }

  public addPricingZone(priceZone: PricingZone): Observable<PricingZoneResponse> {
    let url = environment.serverUrl + environment.api_pricingZone + '/create';

    return this.http.post<PricingZoneResponse>( url, priceZone, { headers: ServiceHelper.getAuthHeader() });
  }

  public updatePricingZone(priceZone: PricingZone): Observable<PricingZoneResponse> {
    let url = environment.serverUrl + environment.api_pricingZone + '/update';

    return this.http.post<PricingZoneResponse>( url, priceZone, { headers: ServiceHelper.getAuthHeader() });
  }
}
