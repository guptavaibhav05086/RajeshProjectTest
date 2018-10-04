import { Discount } from "./Discount";

export class BulkPurchaseDiscount{
applicableTo: string;
calculationBasedOn: string;
discounts: Discount[];
}