import { ApiResponse } from "../shared/ApiResponse";
import { ManufacturerModel } from "./manufacturerModel";

export class ManufacturerResponseModel extends ApiResponse{
    public data: ManufacturerModel;
}