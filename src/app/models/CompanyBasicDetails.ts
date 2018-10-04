import { Proprietor} from './Proprietor'
import { DeliveryAddress} from './DeliveryAddress'
import {    InvoiceAddress} from './InvoiceAddress'
import { BankInformation} from './BankInformation'
import { TermsOfTrade} from './TermsOfTrade'
import { OtherInformation } from './OtherInformation';
import { DocumentsAndAttachments} from './DocumentsAndAttachments';
import { ApiResponse } from '../models/shared/ApiResponse';
import { BuyerProduct } from './buyers/buyerProduct';

export class CompanyBasicDetails{
    _id: string;
    public creditLimit: Number;
    public creditPeriod: Number;
    public seqCode : Number;
    companyName: string;
    businessType: string;
    gstIn: string;
    cinNumber: string;
    panNumber: string;
    established: number;//difference in type
    legalStatus: string;
    websiteUrl: string;
    logoUrl: string;
    photo1Url: string;
    photo2Url: string;
    loanAssistanceRequired: boolean;
    loanAmount: number;
    mobileNumber: number;
    landLineNumber: string;
    emailId: string;
    password:string;
    //mobileAppPassword: string;
    allowmSupplyToCallOrSMS: boolean;
    proprietors: Proprietor[];
    deliveryAddresses: DeliveryAddress[];
    invoiceAddress: InvoiceAddress;
    bankInformation: BankInformation;
    termsOfTrade: TermsOfTrade;
    otherInformation: OtherInformation;
    documentsAndAttachments: DocumentsAndAttachments[];
    createdAt: Date;
    __v: number;
    // CompanyName:string;
    // GSTIN:string;
    // CINNumber:string;
    // CompanyPAN:string;
    // Established:string;//TODO Convert to Number
    EstablishedYear:string[];//TODO Convert to Number
    //WebsiteURL:string;
    BusinessTypes:string[];
    //BusinessType:string;
    LegalStatuses:string[];
    //LegalStatus:string;
    // ProfilePicURL:string;
    // LogoURL:string;
    // LoanAssistance:boolean;
    // LoanAmount:number;
    // MobileNumber:number;
    // LandlineNumber:string;
    // EmailId:string;
    Photo1:File;
    Photo2:File;
    Logo:File;
    IsNotificationAllowed:boolean;
    isMobileValid:boolean;
    isLandlineVaid:boolean;
    isPhoto1ImageSizeValid:boolean;
    isPhoto1ImageValid:boolean
    isPhoto2ImageSizeValid:boolean;
    isPhoto2ImageValid:boolean;
    isLogoImageSizeValid:boolean;
    isLogoImageValid:boolean;
    isEmailValid:boolean;
    status:string;
    public rejectReason: string;
    public products: BuyerProduct[];
    
    Validations(type:string):boolean{

         let result=false;
         if(type=="mobile"){
            
             if(this.mobileNumber.toString().length !=10){
            this.isMobileValid=false;
            result=false;
            }
            else{
                this.isMobileValid=true;
                result=true;
            }
                    }

             if(type=="landline"){
            
             if(this.landLineNumber.toString().length > 15){
            this.isLandlineVaid=false;
            }
            else{
                this.isLandlineVaid=true;
            }
                    }    
                    else if(type=="email"){
                        if(this.emailId==null || this.emailId==""){
                            this.isEmailValid=true;
                            result=true;
                       
                        }
                        else if(this.emailId.indexOf("@") ==-1){
                            this.isEmailValid=false;
                            result=false;
                        
                        }
                        else{
                            this.isEmailValid=true;
                            result=true;
                        }
                                }    
return result;
    }

}

export class CompanyBasicDetailsResponse extends ApiResponse{
    data: CompanyBasicDetails[];
}

export class BuyerCreateUpdateResponse extends ApiResponse{
    data: CompanyBasicDetails;
}


