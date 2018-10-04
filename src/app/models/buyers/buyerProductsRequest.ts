import { Product } from "../Product";
import { BuyerProduct } from "./buyerProduct";

export class BuyerProductsRequest {
    public _id: string;
    public products: BuyerProduct[];
}