import { BulkPurchaseDiscount } from "./BulkPurchaseDiscount";

export class ZonePrice {
    pricingZone:pricingZone;
    pricingZoneId: string;
    pricingZoneName:string;
    minimumOrderQuantity: number;
    minimumRetailPrice: number;
    basicPrice: number;
    gst: number;
    exFactoryPrice: number;
    transportationChargeInPercentage: number;
    transportationChargeFixed: number;
    transportationGst: number;
    transportationTotal:number;
    wareHouseChargeInPercentage: number;
    wareHouseChargeFixed: number;
    wareHouseGst: number;
    wareHouseTotal:number;
    threePlChargeInPercentage: number;
    threePlChargeFixed: number;
    threePlGst: number;
    threePLTotal:number;
    insuranceChargeInPercentage: number;
    insuranceChargeFixed: number;
    insuranceGst: number;
    insuranceTotal:number;

    loadingChargeFixed:number;
    loadingChargeInPercentage: number;
    loadingChargeGst: number;
    loadingChargeTotal:number;

    unloadingChargeFixed:number;
    unloadingChargeInPercentage: number;
    unloadingChargeGst: number;
    unloadingChargeTotal:number;

    othersChargeFixed:number;
    othersChargeInPercentage: number;
    othersChargeGst: number;
    othersChargeTotal:number;

    packagingChargeFixed:number;
    packagingChargeInPercentage: number;
    packagingChargeGst: number;
    packagingChargeTotal:number;

    landingPrice: number;
    pricingSheetUrl: string;
    pricingSheetName:string;
    bulkPurchaseDiscount: BulkPurchaseDiscount;

    isAddedNow:boolean = false;

    //New changes
    CurrentSelectedT:string;
    CurrentSelectedW:string;
    CurrentSelectedP:string;
    CurrentSelectedI:string;
    CurrentSelectedL:string;
    CurrentSelectedO:string;
    CurrentSelectedU:string;
    CurrentSelectedPC:string;


    disableZone:boolean;

}
export class pricingZone{
    isActive: boolean;
    _id: string;
    name: string;
}