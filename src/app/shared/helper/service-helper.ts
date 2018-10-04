import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import * as CryptoJS from 'crypto-js';
import { AuthService } from "../services/authentication/auth.service";
import { HandledErrorResponse } from "../../models/shared/handledErrorResponse";

export class ServiceHelper {
    private static key : string = "36ebe205bcdfc499a25e6923f4450fa8";
    private static iv : string = "be410fea41df7162a679875ec131cf2c";

    public static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`);
          }
          // return an ErrorObservable with a user-facing error message
        //   return new ErrorObservable(
        //     'Something bad happened; please try again later.');
    }

    public static getHostUrl() : string {
        return "http://13.127.174.94:3350";
    }

    public static getGenericHeader() : HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json'});
    }

    public static getAuthHeader() : HttpHeaders {
        let user = AuthService.getUserData();
        return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': user? user.token: "" });
    }
    public static getAuthHeaderFormData() : HttpHeaders {
        let user = AuthService.getUserData();
        return new HttpHeaders({ 'Authorization': user? user.token: "" });
    }

    public static encryptMessage(message) :any{
        var encrypted=  CryptoJS.AES.encrypt(
            message
            ,this.key,
            { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
        });
       // console.log("encypted:- "+ encrypted.toString());
       return encrypted.toString();
    }

    public static decryptMessage(message) :any{
        //console.log(message)
        var decrypted=  CryptoJS.AES.decrypt(
            message
            ,this.key,
            { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
        });
       // console.log("decrypted - "+ decrypted.toString(CryptoJS.enc.Utf8));
       return decrypted.toString(CryptoJS.enc.Utf8);
    }

    public static handleErrorResponse(error: any) : HandledErrorResponse {
        console.log(error);

        if (error.name && error.name == "HttpErrorResponse") {
            return new HandledErrorResponse(error.status, error.error);
        }
        
        return new HandledErrorResponse(600 , "Something went wrong please later");
    }
}
