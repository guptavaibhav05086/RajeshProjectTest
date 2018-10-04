import { ManufacturerModel } from "../manufacturers/manufacturerModel";
import { ProductCategory } from "../ProductCategory";
import { ProductSubCategory } from "../ProductSubCategory";

export class PricingZone {
    _id: string;
    manufacturer: ManufacturerModel;
    category: ProductCategory
    subCategory: ProductSubCategory;
    name: string;
    isActive: boolean;
    isEditing: boolean;

    constructor(manufacturer, category, subCategory) {
        this.manufacturer = manufacturer;
        this.category = category;
        this.subCategory = subCategory;
        this.name = "";
        this.isActive = true;
    }
}