import { Injectable } from '@angular/core';
import { ServiceHelper } from '../../helper/service-helper';
import { UserProfile } from '../../../models/user/user-profile';
import { LoginModel } from '../../../models/user/login-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private static userProfileKey : string = "hkjhsd";
  private headers: HttpHeaders;
  
  private static userData: UserProfile;

  constructor(private http: HttpClient) {
    this.headers = ServiceHelper.getGenericHeader();
  }
  
  public login(url: string, model: LoginModel) : Observable<UserProfile> {
    var body = model;
    return this.http.post<UserProfile>(url,body, { headers: this.headers }) //Use this in prod this.http.post<UserProfile>(url, model, { headers: this.headers })
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(err => {
          throw 'error in source. Details: ' + err;
        })
      );
  }

  // public login(model : LoginModel) : Observable<Response>{
  //   let options = ServiceHelper.getUrlEncodedRequestOption()

  //   return this.http.post(
  //     ServiceHelper.getHostUrl() + 'Token',
  //     model.urlEncodedData(),
  //     options)
  //   .map((response: Response) => {
  //     console.log("Login response", response);

  //     // Save user profile. access token username mobile
  //     let jsonResponse = JSON.parse(response['_body']);
  //     let userProfile = new UserProfile(jsonResponse);
  //     AuthService.saveUserData(userProfile);
      
  //     return response;
  //   })
  //   .catch(ServiceHelper.handleError);
  // }

  // Store user details and jwt token in local storage to keep user logged in between page refreshes
  public static saveUserData(model: UserProfile, rememberMe: boolean): void {
    if (!model) {
      return;
    }
    
    // if (rememberMe) {
      let encrptedData = ServiceHelper.encryptMessage(JSON.stringify(model))
      localStorage.setItem(AuthService.userProfileKey, encrptedData);
    // } else {
    //   this.userData = model;
    // }
  }

  public static getUserData() : UserProfile {
    if (this.userData) {
      return this.userData;
    }

    let strData = localStorage.getItem(AuthService.userProfileKey);
    
    if (strData) {
      let decryptedData = ServiceHelper.decryptMessage(strData)
      let user = new UserProfile(JSON.parse(decryptedData));
      return user;
    }

    return null;
  }

  public static isLoggedIn() : boolean {
    if (this.userData) {
      return true;
    }

    let strData = localStorage.getItem(AuthService.userProfileKey);
    if (strData) {
      return true;
    }

    return false;
  }

  public static logout() : void {
    let strData = localStorage.removeItem(AuthService.userProfileKey);
  }
}
