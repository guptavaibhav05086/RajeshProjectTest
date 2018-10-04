import { ApiResponse } from "../shared/ApiResponse";
import { PricingZone } from "./PricingZone";

export class PricingZonesResponse extends ApiResponse {
    public data: PricingZone[];

}