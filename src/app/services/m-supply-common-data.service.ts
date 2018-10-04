import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { State } from '../models/States';
import  { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class MSupplyCommonDataService {

  constructor( private _httpClient:HttpClient) { }

  /**
 * Comment for method getBusinessType.
 * @param void No Parameters.
 * @returns       Array<string> List of business types.
 */
getBusinessType():Array<string>{
  return ['Retailer','Manufacturer','Wholesaler','Distributor'];
}


 /**
 * Comment for method getLegalStatuses.
 * @param void No Parameters.
 * @returns       Array<string> List of Legal Status.
 */
getLegalStatuses():Array<string>{
  return ['Proprietorship','Partnership','Corporate'];
}

/**
 * Comment for method getEstablishedYearDropDown.
 * @param void No Parameters.
 * @returns       Array<string> List of Established Years.
 */
getEstablishedYearDropDown():Array<string>{
  let EstablishedYear= new Array<string>();
  let currentYear = new Date().getFullYear();
  for(let i=currentYear; i >= 1900 ; i--){
      EstablishedYear.push(i.toString());

  }
  return EstablishedYear;
}
/**
 * Comment for method getAccountType.
 * @param void No Parameters.
 * @returns       Array<string> List of Account Types.
 */
getAccountType():Array<string>{
let AccountType=new Array<string>();
AccountType=['Savings','Current'];
return AccountType;
}
/**
 * Comment for method getDateFormatForBSDateControl.
 * @param void No Parameters.
 * @returns       Array<string> List of Account Types.
 */
getDateFormatForBSDateControl(_dateSupplied:Date):any{
    var objectDate={
        year:0,
        month:0,
        day:0
    };
    if(_dateSupplied !=null){
        _dateSupplied = new Date(_dateSupplied.toString());
         objectDate.year = _dateSupplied.getFullYear();
         objectDate.month= _dateSupplied.getMonth()+1;
         objectDate.day=_dateSupplied.getDate();


    }
    return objectDate;
}

/**
 * Comment for method getDateFormatForBSDateControl.
 * @param void No Parameters.
 * @returns       Array<string> List of Account Types.
 */
getGSTRates():number[]{
    return [0,5,12,18,28]

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
testService():any{
  let result = [
    {
        "api": "update",
        "request": {
            "status": "Pending",
            "creditLimit": 0,
            "creditPeriod": 0,
            "_id": "5b2ebe0f3f7d0514a4bfe2bc",
            "companyName": "Samsung",
            "businessType": "Manufacturer",
            "gstIn": "22AAAAA0000A1Z5",
            "cinNumber": "98543443",
            "panNumber": "BJRPG4869S",
            "established": 2017,
            "legalStatus": "Partnership",
            "websiteUrl": "http://newstein.in",
            "logoUrl": "http://newstein.in/img/logo-4.png",
            "photo1Url": "http://newstein.in/img/anish.jpg",
            "photo2Url": "http://newstein.in/img/gaurav.jpg",
            "loanAssistanceRequired": true,
            "loanAmount": 2000.30,
            "mobileNumber": "9590052440",
            "landLineNumber": "9590052440",
            "emailId": "example@gmail.com",
            "mobileAppPassword": "itisapassword",
            "allowmSupplyToCallOrSMS": true,
            "proprietors": [
                {
                    "_id": "5b2ebe0f3f7d0514a4bfe2bf",
                    "name": "Anish123",
                    "dateOfBirth": "26 May 1992",
                    "emailId": "anishism753@gmail.com",
                    "mobileNumber": "9876543267",
                    "address": {
                        "_id": "5b2ebe0f3f7d0514a4bfe2c0",
                        "line1": "Venkatapura Main Rd, Jakkasandra",
                        "line2": "1st Block Koramangala, HSR Layout 5th Sector",
                        "state": "Uttar Pradesh",
                        "city": "Farrukhabad",
                        "pincode": "560034",
                        "createdAt": "2018-06-23T21:39:27.031Z"
                    }
                },
                {
                    "_id": "5b2ebe0f3f7d0514a4bfe2bd",
                    "name": "Vaibhav",
                    "dateOfBirth": "26 May 1992",
                    "emailId": "vaibhav@gmail.com",
                    "mobileNumber": "9876543267",
                    "address": {
                        "_id": "5b2ebe0f3f7d0514a4bfe2be",
                        "createdAt": "2018-06-22T17:59:29.104Z",
                        "line1": "Venkatapura Main Rd, Jakkasandra",
                        "line2": "1st Block Koramangala, HSR Layout 5th Sector",
                        "state": "Uttar Pradesh",
                        "city": "Kanpur",
                        "pincode": "560034"
                    }
                }
            ],
            "deliveryAddresses": [
                {
                    "_id": "5b2ebe0f3f7d0514a4bfe2c1",
                    "address": {
                        "_id": "5b2ebe0f3f7d0514a4bfe2c2",
                        "line1": "Venkatapura Main Rd, Jakkasandra",
                        "line2": "1st Block Koramangala, HSR Layout 5th Sector",
                        "state": "Uttar Pradesh",
                        "city": "Lucknow",
                        "pincode": "560034",
                        "createdAt": "2018-06-23T21:39:27.031Z"
                    },
                    "contactPerson": {
                        "_id": "5b2ebe0f3f7d0514a4bfe2c3",
                        "name": "Satish G",
                        "designation": "Doctor",
                        "mobileNumber": "9590052440",
                        "landLineNumber": "9590052440",
                        "emailId": "example@gmail.com"
                    }
                }
            ],
            "invoiceAddress": {
              "address":{
                "_id": "5b2ebe0f3f7d0514a4bfe2c4",
                "line1": "Venkatapura Main Rd, Jakkasandra",
                "line2": "1st Block Koramangala, HSR Layout 5th Sector",
                "state": "Uttar Pradesh",
                "city": "Lucknow",
                "pincode": "560034",
                "createdAt": "2018-06-23T21:39:27.031Z"
              },
              "contactPerson": {
                  "_id": "5b2ebe0f3f7d0514a4bfe2c3",
                  "name": "Satish G",
                  "designation": "Doctor",
                  "mobileNumber": "9590052440",
                  "landLineNumber": "9590052440",
                  "emailId": "example@gmail.com"
              }
            },
            "bankInformation": {
                "_id": "5b2ebe0f3f7d0514a4bfe2c5",
                "accountHolderName": "Gaurav Kuamr",
                "accountNumber": "20032066644",
                "accountType": "Savings Account",
                "ifscCode": "SBIN0020852",
                "chequeImageUrl": "http://www.findcreditcardstatus.com/wp-content/uploads/2017/01/sbi-cheque-book.jpg"
            },
            "termsOfTrade": {
                "_id": "5b2ebe0f3f7d0514a4bfe2c7",
                "numberOfBlankChequeReceived": 10,
                "chequeNumber": "238758399",
                "chequeDate": "2018-06-22T00:00:00.000Z",
                "modeOfPaymentDetails": "Agent",
                "authorizeMSupply": false,
                "nameOfCommonPartner": "VAGL"
            },
            "otherInformation": {
                "billingSoftware":"Tally",
                "turnOver":"1 Million"
            },
            "documentsAndAttachments": [
                {
                "documentName":"invoice",
                "fileName":null,
                "fileUrl":null
        }
    ],
            "createdAt": "2018-06-23T21:39:27.031Z",
            "__v": 0
        }
    }    
];
return result;
}
}
