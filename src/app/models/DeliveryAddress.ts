import { State } from './States'
import { Address} from './Address'
import {ContactPerson } from './ContactPerson'
import { City } from './City';
import { Location } from '../models/address/location'
import { AddressLocation } from './addressLocation';

export class DeliveryAddress{
    public DeliveryID:number;
    _id: string;
    address: Address;
    contactPerson: ContactPerson;
    // public line1:string;
    // public line2:string;
    public states:State[];
    public selectedCities:City[];
     public selectedCity:City;
     public selectedState:State;
     public selectedLocations:AddressLocation[];
     public selectedLocation:AddressLocation;
     public mappedZoneId;
     //public addreestoZoneMapping:Array<any>;
    // public pincode:number;
    // public emailId:string;
    // public mobileNumber:number;
    // public landLineNumber:number;
    // public contactPerson:string;
    // public designation:string;
    public useAsInvoice:boolean;
    public IsStateValid:boolean;
    public isCityValid:boolean;
    public isPinValid:boolean;
    public isMobileValid:boolean;
    public isMobileFilled:boolean;
    public isEmailValid:boolean;
    public isEmailFilled:boolean;
    public isAddressLine1Valid:boolean;
    public isContactPersonValid:boolean;
    public isDesignationValid:boolean;

     ValidateDeliveryAddress(type:string):boolean {
         let result=false;
        if(type=="state")
        {
if(this.address.state==null)
{
this.IsStateValid=false;
result=false;
}
else{
    this.IsStateValid=true;
    result=true;
}
        }
        else if(type=="city"){
if(this.address.city==null){
this.isCityValid=false;
result=false;

}
else{
    this.isCityValid=true;
    result=true;
}
        }
        else if(type=="aline1"){
            if(this.address.line1==null || this.address.line1 == ""){
            this.isAddressLine1Valid=false;
            result=false;
            }
            else{
                this.isAddressLine1Valid=true;
                result=true;
            }
                    }
        else if(type=="pin"){
if(this.address.pincode==null ){
this.isPinValid=false;
result=false;
}
else if(this.address.pincode.toString().length !=6){
this.isPinValid=false;
result=false;
}
else{
    this.isPinValid=true;
    result=true;
}
        }
        else if(type=="mobile"){
            if(this.contactPerson.mobileNumber==null || this.contactPerson.mobileNumber==0){
            this.isMobileFilled=false;
            this.isMobileValid=true;
            result=true;
            }
            
            else if(this.contactPerson.mobileNumber.toString().length !=10){
            this.isMobileValid=false;
            result=false;
            }
            
            else{
                this.isMobileValid=true;
                result=true;
            }
             if(this.contactPerson.mobileNumber !=null || this.contactPerson.mobileNumber==0){
                this.isMobileFilled=true;
                            }
                    }
                    else if(type=="email"){
                        if(this.contactPerson.emailId==null || this.contactPerson.emailId==""){
                            this.isEmailValid=true;
                            result=true;
                       
                        }
                        else if(this.contactPerson.emailId.indexOf("@") ==-1){
                            this.isEmailValid=false;
                            result=false;
                        
                        }
                        else{
                            this.isEmailValid=true;
                            result=true;
                        }
                                }
                                else if(type=="cPerson"){
                                    if(this.contactPerson.name==null || this.contactPerson.name==""){
                                    this.isContactPersonValid=false;
                                    result=false;
                                    
                                    }
                                    else{
                                        this.isContactPersonValid=true;
                                        result=true;
                                    }
                                            }

                             else if(type=="designation"){
                                                if(this.contactPerson.designation==null  || this.contactPerson.designation==""){
                                                this.isDesignationValid=false;
                                                
                                                }
                                                else{
                                                    this.isDesignationValid=true;
                                                }
                                                        }

                    return result;
    } 
}