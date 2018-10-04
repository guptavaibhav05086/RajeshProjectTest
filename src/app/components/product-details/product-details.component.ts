import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../../models/Product';
import { MsupplyproductpricingService } from '../../services/msupplyproductpricing.service';
import { ProductDimension } from '../../models/ProductDimensions';
import { count } from 'rxjs/operator/count';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productDetailsList: Array<Product>
  manufactureId: any
  dimesionPattern = "^([1-9]\d*(\.\d+)?)$"
  prdct: Product;
  isOtherBrandSelected: boolean;
  newBrand: string;
  newProductType: string;
  isOtherTypeSelected: string;
  slectedBrand: string;
  selectedType: string;



  constructor(private _mSupplyProductService: MsupplyproductpricingService) {


  }

  ngOnInit() {
    this.manufactureId = 0;
    this.AddNewProduct();
    this.isOtherBrandSelected = false;
    this.isOtherTypeSelected = "others";
    this._mSupplyProductService.getProducts().subscribe(data => {
      this.productDetailsList = data;
      console.log(this.productDetailsList);
    }

    );
  }

  /**
   * Comment for AddNewProduct.
   * @param target  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
  AddNewProduct() {
    var productDetails = new Product();
    // productDetails.subCategoryList = this._mSupplyDataService.getProductSubCategoryList(this.manufactureId);
    // productDetails.productCategoryList = this._mSupplyDataService.getProductCategory();
    // productDetails.productTypeList = this._mSupplyDataService.getProductType();
    // productDetails.brandList = this._mSupplyDataService.getBrand()
    this.selectedType = "";
    // if (this.productDetailsList.length > 0) {
    //  productDetails.productDetailId = (this.productDetailsList[this.productDetailsList.length - 1].productDetailId + 1);
    // }
    // else {
    //   productDetails.productDetailId = 1;

    // }
    //this.productDetailsList.push(productDetails);
  }

  /**
    * Comment for SaveProductDetails.
    * @param productDetailsList Comment for parameter ´target´.
    * @returns       Comment for return value.
    */
  SaveProductDetails() {
    //this._mSupplyProductService.saveProductDetails(this.productDetailsList);
  }

  /**
  * Comment for SaveProductDetails.
  * @param productDetailsList Comment for parameter ´target´.
  * @returns       Comment for return value.
  */
  addProductDetails(product: Product) {
    this.prdct = product;
    var productDimension = new ProductDimension()
    this.prdct.dimension = productDimension;
  }

  /**
 * Comment for otherBrandSelected.
 * @param productDetailsList Comment for parameter ´target´.
 * @returns       Comment for return value.
 */
  otherBrandSelected() {

    this.isOtherBrandSelected = !this.isOtherBrandSelected;
  }

  /**
  * Comment for otherBrandSelected.
  * @param productDetailsList Comment for parameter ´target´.
  * @returns       Comment for return value.
  */
  otherProductTypeSlctd(index) {
    console.log("sfsfa");
    //console.log(this.productDetailsList[index].selectedProductType)
    // alert(this.selectedType);
    // this.isOtherTypeSelected = this.isOtherTypeSelected+i;

  }

  /**
  * Comment for addNewBrand.
  * @param productDetailsList Comment for parameter ´target´.
  * @returns       Comment for return value.
  */
  addNewBrand() {
   // this._mSupplyDataService.addNewBrand(this.newBrand);
  }

  /**
  * Comment for addNewBrand.
  * @param productDetailsList Comment for parameter ´target´.
  * @returns       Comment for return value.
  */
  addNewProductType() {
    //this._mSupplyDataService.addNewProductType(this.newProductType);
  }
}
