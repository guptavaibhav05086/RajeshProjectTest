import { State } from './States'
import { City} from './City'
import {Address } from './Address'
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
export class Proprietor{
    public ProprietorID:number;
    _id: string;
    name: string;
    dateOfBirth: Date;//Type Difference from model schema
    emailId: string;
    mobileNumber: number;//Type Difference from model schema
    address: Address;
    dobDatePicker:NgbDatepicker;
    //dateOfBirth:string;
   // public ProprietorName: string;
    //public line1:string;
    //public line2:string;
    public states:State[];
    public selectedCities:City[];
    public selectedCity:City;
    public selectedState:State;
    //public pincode:string;
    //public proprietorEmail:string;
    //public proprietorMobileNumber:number;
    //public proprietorDOB:Date;
    public IsStateValid:boolean;
    public isCityValid:boolean;
    public isPinValid:boolean;
    public isMobileValid:boolean;
    public isEmailValid:boolean;
    public isDOBValid:boolean;

    validateDOB():boolean{
        let todaysDate= new Date();
        let checkyear = this.dateOfBirth['year'] -18;
        let checkMonth=this.dateOfBirth['month'];
        let checkDate=this.dateOfBirth['day']

        let currentYear = todaysDate.getFullYear();
        let currentMonth = todaysDate.getMonth() + 1;
        let currentDate = todaysDate.getDate();
        if(currentYear < checkyear){
            this.isDOBValid=true;

        }
        else if(currentYear == checkyear){
            if(currentMonth > checkMonth){
                this.isDOBValid=true;

            }
            else if(currentMonth < checkMonth){
                this.isDOBValid=false;

            }
            else{
                if(currentDate => checkDate){
                    this.isDOBValid=true;

                }
                else{
                    this.isDOBValid=false;

                }
            }


        }
        else{
            this.isDOBValid=false;
        }
        return this.isDOBValid;
    }
     ValidateAddress(type:string):boolean {
         let isValid=true;
         if(type =='dob'){
            isValid= this.validateDOB();

         }
        if(type =="state")
        {
if(this.address.state==null)
{
this.IsStateValid=false;
isValid=false;
}
else{
    this.IsStateValid=true;
    isValid=true;
}
        }
        else if(type=="city"){
if(this.address.city==null){
this.isCityValid=false;
isValid=false;

}
else{
    this.isCityValid=true;
    isValid=true;
}
        }
        else if(type=="pin"){
if(this.address.pincode==null ){
this.isPinValid=true;
isValid=true;
}
else if(this.address.pincode.toString().length !=6){
this.isPinValid=false;
isValid=false;
}
else{
    this.isPinValid=true;
    isValid=true;
}
        }
        else if(type=="mobile"){
            if(this.mobileNumber==null || this.mobileNumber==0){
            this.isMobileValid=true;
            isValid=true;
            }
            else if(this.mobileNumber.toString().length !=10){
            this.isMobileValid=false;
            isValid=false;
            }
            else{
                this.isMobileValid=true;
                isValid=true;
            }
                    }
                    else if(type=="email"){
                        if(this.emailId==null || this.emailId==""){
                            this.isEmailValid=true;
                            isValid=true;
                       
                        }
                        else if(this.emailId.indexOf("@") ==-1){
                        this.isEmailValid=false;
                        isValid=false;
                        }
                         
                        else{
                            this.isEmailValid=true;
                            isValid=true;
                        }
                                }
                                return isValid;
    }

     
    /* validateDOB():boolean{
        let todaysDate= new Date();
        let checkyear = this.proprietorDOB['year'] -18;
        let checkMonth=this.proprietorDOB['month'];
        let checkDate=this.proprietorDOB['day']

        let currentYear = todaysDate.getFullYear();
        let currentMonth = todaysDate.getMonth() + 1;
        let currentDate = todaysDate.getDate();
        if(currentYear < checkyear){
            this.isDOBValid=true;

        }
        else if(currentYear == checkyear){
            if(currentMonth > checkMonth){
                this.isDOBValid=true;

            }
            else if(currentMonth < checkMonth){
                this.isDOBValid=false;

            }
            else{
                if(currentDate => checkDate){
                    this.isDOBValid=true;

                }
                else{
                    this.isDOBValid=false;

                }
            }


        }
        else{
            this.isDOBValid=false;
        }
        return this.isDOBValid;
    }
     ValidateAddress(type:string):boolean {
         let isValid=true;
         if(type='dob'){
            isValid= this.validateDOB();

         }
        if(type=="state")
        {
if(this.selectedState==null)
{
this.IsStateValid=false;
isValid=false;
}
else{
    this.IsStateValid=true;
    isValid=true;
}
        }
        else if(type=="city"){
if(this.selectedCity==null){
this.isCityValid=false;
isValid=false;

}
else{
    this.isCityValid=true;
    isValid=true;
}
        }
        else if(type=="pin"){
if(this.pincode==null || this.pincode == ""){
this.isPinValid=true;
isValid=true;
}
else if(this.pincode.toString().length !=6){
this.isPinValid=false;
isValid=false;
}
else{
    this.isPinValid=true;
    isValid=true;
}
        }
        else if(type=="mobile"){
            if(this.proprietorMobileNumber==null || this.proprietorMobileNumber==0){
            this.isMobileValid=true;
            isValid=true;
            }
            else if(this.proprietorMobileNumber.toString().length !=10){
            this.isMobileValid=false;
            isValid=false;
            }
            else{
                this.isMobileValid=true;
                isValid=true;
            }
                    }
                    else if(type=="email"){
                        if(this.proprietorEmail==null || this.proprietorEmail==""){
                            this.isEmailValid=true;
                            isValid=true;
                       
                        }
                        else if(this.proprietorEmail.indexOf("@") ==-1){
                        this.isEmailValid=false;
                        isValid=false;
                        }
                         
                        else{
                            this.isEmailValid=true;
                            isValid=true;
                        }
                                }
                                return isValid;
    } */ 
}