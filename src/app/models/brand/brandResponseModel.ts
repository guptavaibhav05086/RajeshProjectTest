import { ApiResponse } from "../shared/ApiResponse";
import { Brands } from "../Brands";

export class BrandResponseModel extends ApiResponse {
    public data: Brands;
}