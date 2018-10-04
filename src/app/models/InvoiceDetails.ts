import { State } from './States'

export class InvoiceDetails {
    public line1: string;
    public line2: string;
    public states: State[];
    public selectedCities: string[];
    public selectedCity: string;
    public selectedState: string;
    public pincode: number;
    public IsStateValid: boolean;
    public isCityValid: boolean;
    public isPinValid: boolean;
    public isAddressLine1Valid: boolean;

    ValidateInvoiceAddress(type: string) {
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
        else if (type == "aline1") {
            if (this.line1 == null || this.line1 == "") {
                this.isAddressLine1Valid = false;

            }
            else {
                this.isAddressLine1Valid = true;
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

    }
}