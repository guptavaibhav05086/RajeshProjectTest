import { ManufacturerPriceMapping } from '../models/ManufacturerPriceMapping';
import { ProductDimension } from '../models/ProductDimensions';
import {ProductCategory} from '../models/ProductCategory'
import {ProductSubCategory} from '../models/ProductSubCategory'
import {ProductType} from '../models/ProductType'
import {Brand} from '../models/Brand'
import {Manufacturer} from '../models/manufacturer'
import { Zone } from './Zone';

export class Product {
    status: string;
    _id: string;
    manufacturer: Manufacturer;
    code: string;
    category: ProductCategory;
    categoryName:string;
    subCategory: ProductSubCategory;
    subCategoryName:string;
    name: string;
    type: ProductType;
    typeName:string;
    statusChecked:boolean;
    uom: string;
    brand: Brand;
    brandName:string;
    gradeOrSpec: string;
    hsnCode: string;
    imageUrl: string;
    description: string;
    areasOfApplication: string;
    dimension: ProductDimension;
    validityStart:string;
    validityEnd:string;
    startTime:string;
    endTime:string;
    IsNewPricing:boolean;
    IsSaveDisable : boolean
    latestPriceId:string;
    disableToPrice:boolean;
    manuFacturerPriceMapping:ManufacturerPriceMapping;
    prodGST:number;

    // To be used in buyer product selection
    public isChecked: boolean;
    public isSubmitted:boolean;
    public disbaleAddPrice:boolean;

    public productCategoryList: Array<ProductCategory>;
    public subCategoryList: Array<ProductSubCategory>;
    public productTypeList: Array<ProductType>;
    public brandList: Array<Brand>;
}

export class ProductsData {
    products: Product[];
    categories: ProductCategory[];
    subCategories: ProductSubCategory[];
    productTypes: ProductType[];
    brands: Brand[];
    priceZones: Zone[];
}