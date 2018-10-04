import { ManufacturerModel } from "./manufacturerModel";
import { ProductCategory } from "../ProductCategory";
import { ProductSubCategory } from "../ProductSubCategory";

export class ManufacturersWithCategories {
    public manufacturers: ManufacturerModel[];
    public categories: ProductCategory[];
    public subCategories: ProductSubCategory[];
}