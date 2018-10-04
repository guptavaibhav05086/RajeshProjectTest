import { CurrentProductDetail } from "./CurrentProductDetail";
import { SalesPerson } from "./salesPerson";

export class OtherInformation{
    billingSoftware:string;
    turnOver:string;
    salesPerson:SalesPerson;
    currentProducts:CurrentProductDetail[];
    salesPersonList:string[]
}