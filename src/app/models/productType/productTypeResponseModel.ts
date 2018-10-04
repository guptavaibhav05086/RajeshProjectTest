import { ApiResponse } from "../shared/ApiResponse";
import { ProductType } from "../ProductType";

export class ProductTypeResponseModel extends ApiResponse {
    public data: ProductType;
}