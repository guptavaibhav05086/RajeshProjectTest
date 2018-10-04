import { ApiResponse } from "../shared/ApiResponse";
import { BuyersAggregate } from "./buyersAggregate";

export class BuyersAggregateResponse extends ApiResponse {
    data: BuyersAggregate;
}