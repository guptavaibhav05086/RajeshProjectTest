import { BootstrapOptions } from "@angular/core/src/application_ref";
import { Product , ProductsData} from '../models/Product';

export class ProductResponse {
    public isValid : Boolean;
    public data : ProductsData;
    public errors : string[];
}