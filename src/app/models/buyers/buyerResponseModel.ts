import { ApiResponse } from "../shared/ApiResponse";
import { CompanyBasicDetails } from "../CompanyBasicDetails";

export class BuyerResponseModel extends ApiResponse {
    public data: CompanyBasicDetails;
}