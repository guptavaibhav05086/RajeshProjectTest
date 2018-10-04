import { State } from './States'
import { Address } from './Address'
import { ContactPerson} from './ContactPerson'
import { City } from './City';

export class InvoiceAddress{
    public _id: string;
    //public line1:string;
    //public line2:string;
    public states:State[];
    public selectedCities:City[];
    public address: Address;
    public contactPerson: ContactPerson;
    public selectedCity:City;
    public selectedState:State;
    //public pincode:number;
    //public contactPerson:string;
    //public designation:string;
    //public mobileNumber:number;
    //public emailId:string;
    public IsStateValid:boolean;
    public isCityValid:boolean;
    public isPinValid:boolean;
    public isAddressLine1Valid:boolean;
    public isMobileValid:boolean;
    public isEmailValid=true;

     ValidateInvoiceAddress(type:string):boolean {
         let result=false;
        if(type=="state")
        {
if(this.address.state==null)
{
this.IsStateValid=false;
}
else{
    this.IsStateValid=true;
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
                result=true;
            }
                    }
        else if(type=="city"){
if(this.address.city==null){
this.isCityValid=false;

}
else{
    this.isCityValid=true;
}
        }
        else if(type=="aline1"){
            if(this.address.line1==null || this.address.line1 == ""){
            this.isAddressLine1Valid=false;
            
            }
            else{
                this.isAddressLine1Valid=true;
            }
                    }
        else if(type=="pin"){
if(this.address.pincode==null){
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
             if( this.contactPerson.mobileNumber!=null && this.contactPerson.mobileNumber.toString().length !=10){
            this.isMobileValid=false;
            result=false;
            }
            
            else{
                this.isMobileValid=true;
                result=true;
            }
             
                    }
                   return result; 
    } 
}