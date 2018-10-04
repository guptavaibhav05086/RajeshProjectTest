import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CompanyBasicDetails, CompanyBasicDetailsResponse, BuyerCreateUpdateResponse } from '../models/CompanyBasicDetails';
import { Observable, of } from 'rxjs'
import { environment } from '../../environments/environment'
import { catchError, retry } from 'rxjs/operators';
import { State, StateAPiResponse } from '../models/States';
import { ServiceHelper} from '../shared/helper/service-helper'

import { ManufacturerPriceMapping } from '../models/ManufacturerPriceMapping';

@Injectable()
export class MsupplyFormRegistrationService {

  Token: string;
  constructor(private _httpClient: HttpClient) {

  }
  /**
  * Comment for method getManufacturerRegistrationForm.
  * @param id   Manufacturer registration id .
  * @returns  obseravable for companyDetails Type.
  */
 getSalesPersonData(): Observable<any> {
let url = environment.serverUrl + environment.api_Seller;
return this._httpClient.get<any>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3),
      catchError(this.handleError<any>("getSalesPersonData")));

 }
  /**
  * Comment for method getManufacturerRegistrationForm.
  * @param id   Manufacturer registration id .
  * @returns  obseravable for companyDetails Type.
  */
  getBuyerRegistrationForm(id: string): Observable<any> {
    //let url = environment.serverUrl + environment.api_getManufacturer + "?id=" + id;
    let url = environment.serverUrl + environment.api_getBuyer + "/" + id;
    return this._httpClient.get<any>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3),
      catchError(this.handleError<any>("getManufacturerRegistrationForm")));

  }


  /**
  * Comment for method getManufacturerRegistrationForm.
  * @param id   Manufacturer registration id .
  * @returns  obseravable for companyDetails Type.
  */
  createBuyerForm(manuFacturerDetails: CompanyBasicDetails): Observable<BuyerCreateUpdateResponse> {
    return this._httpClient
      .post<boolean>(environment.serverUrl + environment.api_CreateBuyer,
        JSON.stringify(manuFacturerDetails)
        ,{ headers: ServiceHelper.getAuthHeader() })
      .pipe(catchError(this.handleError<any>('createUpdateManufacturerForm Error Data')));;
  }
 /**
  * Comment for method getManufacturerRegistrationForm.
  * @param id   Manufacturer registration id .
  * @returns  obseravable for companyDetails Type.
  */
  updateBuyerForm(manuFacturerDetails: CompanyBasicDetails): Observable<BuyerCreateUpdateResponse> {
    return this._httpClient
      .post<boolean>(environment.serverUrl + environment.api_updateBuyer,
        JSON.stringify(manuFacturerDetails)
        ,{ headers: ServiceHelper.getAuthHeader() })
      .pipe(catchError(this.handleError<any>('createUpdateManufacturerForm Error Data')));;
  }

  /**
* Comment for method getManufacturerRegistrationForm.
* @param id   Manufacturer registration id .
* @returns  obseravable for companyDetails Type.
*/
  getManufacturerRegistrationForm(id: string): Observable<any> {
    //let url = environment.serverUrl + environment.api_getManufacturer + "?id=" + id;
    let url = environment.serverUrl + environment.api_manufacturers + "/" + id;;
    return this._httpClient.get<any>(url, { headers: ServiceHelper.getAuthHeader() }).pipe(retry(3),
      catchError(this.handleError<any>("getManufacturerRegistrationForm")));

  }


  /**
  * Comment for method getManufacturerRegistrationForm.
  * @param id   Manufacturer registration id .
  * @returns  obseravable for companyDetails Type.
  */
  createManufacturerForm(manuFacturerDetails: CompanyBasicDetails): Observable<any> {
    return this._httpClient
      .post<any>(environment.serverUrl + environment.api_CreateManufacturer,
        JSON.stringify(manuFacturerDetails)
        ,{ headers: ServiceHelper.getAuthHeader() });
  }
 /**
  * Comment for method getManufacturerRegistrationForm.
  * @param id   Manufacturer registration id .
  * @returns  obseravable for companyDetails Type.
  */
  updateManufacturerForm(manuFacturerDetails: CompanyBasicDetails): Observable<any> {
    return this._httpClient
      .post<any>(environment.serverUrl + environment.api_updateManufacturer,
        JSON.stringify(manuFacturerDetails)
        ,{ headers: ServiceHelper.getAuthHeader() })
  }
  /**
* Comment for method getManufacturerList.
* @param id   Manufacturer registration id .
* @returns  obseravable for companyDetails Type.
*/
  getManufacturerList(): Observable<CompanyBasicDetailsResponse> {
    //let url = environment.serverUrl + environment.api_getManufacturer + "?id=" + id;
    let url = environment.serverUrl + environment.api_manufacturers;
    return this._httpClient.get<CompanyBasicDetailsResponse>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3),
      catchError(this.handleError<any>("getManufacturerRegistrationForm")));

  }

   /**
* Comment for method getManufacturerRegistrationForm.
* @param id   Manufacturer registration id .
* @returns  obseravable for companyDetails Type.
*/
  getStates(): Observable<any[]> {
    let url = environment.serverUrl + environment.api_getStates;
    return this._httpClient.get<any[]>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3),
      catchError(this.handleError<any>("getStates")));

  }

  /**
   * Comment for method getHeaders.
   * @param Void  Need to be deleted.
   * @returns       Comment for return value.
   */
  postFile(formData: FormData): Observable<boolean> {
   
    return this._httpClient
      .post(environment.serverUrl + environment.api_uploadFormFiles, formData ,{ headers: ServiceHelper.getAuthHeader() })
      .pipe(catchError(this.handleError<any>('Form Upload Error')));
  }

/**
 * Comment for method getBusinessType.
 * @param void No Parameters.
 * @returns       Array<string> List of business types.
 */
getStatesAndCities():Observable<any>{
  let url = environment.serverUrl + environment.api_states;
  return this._httpClient.get<any>(url,{ headers: ServiceHelper.getAuthHeader() });
  //return this._httpClient.get<States[]>(url,this.getHeaders());
}
postMsupplyFiles(fileToUpload: File, mappedName:string): Observable<any> {
  
    let formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    //formData.append('MappedName', mappedName);
console.log(ServiceHelper.getAuthHeader());
    return this._httpClient
      .post<any>(environment.serverUrl + environment.api_uploadFormFiles, formData, 
        { headers: ServiceHelper.getAuthHeaderFormData() })
      .pipe(catchError(this.handleError<any>('Form Upload Error')));
  }

  /**
* Comment for method getManufacturerList.
* @param id   Manufacturer registration id .
* @returns  obseravable for companyDetails Type.
*/
getBuyersList(): Observable<CompanyBasicDetailsResponse> {
  //let url = environment.serverUrl + environment.api_getManufacturer + "?id=" + id;
  let url = environment.serverUrl + environment.api_getBuyer;
  return this._httpClient.get<CompanyBasicDetailsResponse>(url,{ headers: ServiceHelper.getAuthHeader() }).pipe(retry(3),
    catchError(this.handleError<any>("getManufacturerRegistrationForm")));

}

  /**
  * Comment for method getHeaders.
  * @param Void  Need to be deleted.
  * @returns       Comment for return value.
  */
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

  /**
   * Comment for method handleError.
   * @param operation   operation name which created this error .
   * @param result   optional parameter to get error data from service .
   * @returns  obseravable for companyDetails Type.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      alert(error.error.error_description);
      return of(error as T);
    };
  }


}
