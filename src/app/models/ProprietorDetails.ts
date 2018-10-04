import { State } from './States'
export class ProprietorDetails {
    public ProprietorID: number;
    public ProprietorName: string;
    public line1: string;
    public line2: string;
    public states: State[];
    public selectedCities: string[];
    public selectedCity: string;
    public selectedState: string;
    public pincode: number;
    public proprietorEmail: string;
    public proprietorMobileNumber: number;
    public proprietorDOB: Date;
    public IsStateValid: boolean;
    public isCityValid: boolean;
    public isPinValid: boolean;
    public isMobileValid: boolean;
    public isEmailValid: boolean;

    ValidateAddress(type: string) {
        if (type == "state") {
            if (this.selectedState == null) {
                this.IsStateValid = false;
            }
            else {
                this.IsStateValid = true;
            }
        }
        else if (type == "city") {
            if (this.selectedCity == null) {
                this.isCityValid = false;

            }
            else {
                this.isCityValid = true;
            }
        }
        else if (type == "pin") {
            if (this.pincode == null || this.pincode == 0) {
                this.isPinValid = false;
            }
            else if (this.pincode.toString().length != 6) {
                this.isPinValid = false;
            }
            else {
                this.isPinValid = true;
            }
        }
        else if (type == "mobile") {
            if (this.proprietorMobileNumber == null || this.proprietorMobileNumber == 0) {
                this.isMobileValid = false;
            }
            else if (this.proprietorMobileNumber.toString().length != 10) {
                this.isMobileValid = false;
            }
            else {
                this.isMobileValid = true;
            }
        }
        else if (type == "email") {
            if (this.proprietorEmail.indexOf("@") == -1) {
                this.isEmailValid = false;
            }
            else {
                this.isEmailValid = true;
            }
        }
    }
}