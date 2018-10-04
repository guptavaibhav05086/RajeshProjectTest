import { ZonePrice} from '../models/ZonePrice'
import { Product } from './Product';
export class ManufacturerPriceMapping {
    _id:string;
    product:Product;
    productId: string;
    validityStartTime: string;
    validityEndTime: string;
    zonePrices: ZonePrice[];
    createdBy:string;
    //New Fields

    createdAt:string;

    updatedAt:string;

    updatedBy:string;
}