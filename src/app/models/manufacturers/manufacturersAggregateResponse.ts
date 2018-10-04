import { ApiResponse } from "../shared/ApiResponse";
import { ManufacturerAggregate } from "./manufacturerAggregate";

export class ManufacturerAggregateResponse extends ApiResponse {
    data: ManufacturerAggregate;
}