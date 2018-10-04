import { Product } from "../Product";
import { DeliveryAddressZoneMapping } from "./deliveryAddressZoneMapping";

export class BuyerProduct {
    public product: string;
    public addressZoneMapping: DeliveryAddressZoneMapping[];
    public zoneMapping:string;
}