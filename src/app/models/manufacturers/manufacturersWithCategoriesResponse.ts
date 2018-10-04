import { ApiResponse } from "../shared/ApiResponse";
import { ManufacturersWithCategories } from "./manufacturersWithCategories";

export class ManufacturersWithCategoriesResponse extends ApiResponse {
    data: ManufacturersWithCategories;
}