import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCategory } from './../../models/ProductCategory'
import { ProductSubCategory } from './../../models/ProductSubCategory'
import { ProductType } from './../../models/ProductType'
import { Brand } from './../../models/Brand'
import { Product } from '../../models/Product';
import { ProductDimension } from './../../models/ProductDimensions'
import { ProductserviceService } from '../../services/productservice.service';
import { ProductTypeResponseModel } from '../../models/productType/productTypeResponseModel';
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { Router } from '@angular/router';
import { BrandResponseModel } from '../../models/brand/brandResponseModel';
import { MsupplyFormRegistrationService } from '../../services/msupply-form-registration.service'
import { Manufacturer } from '../../models/manufacturer';
import { AuthService } from '../../shared/services/authentication/auth.service';


@Component({
  selector: 'app-add-edit-product-modal',
  templateUrl: './add-edit-product-modal.component.html',
  styleUrls: ['./add-edit-product-modal.component.css']
})
export class AddEditProductModalComponent implements OnInit {

  @Input() product: Product;
  @Input() categories: Array<ProductCategory>;
  @Input() subCategories: Array<ProductSubCategory>;
  @Input() productTypes: Array<ProductType>;
  @Input() brands: Array<Brand>;
  @Input() manufacturerId: string;
  public preBrandId : any;
  public preProductTypeId : string;

  @ViewChild('productForm')
    registrationForm: HTMLFormElement;

  productType: string;
  brand: string;
  isImageValid: boolean
public disableCode:boolean;
  public loading: boolean;
  public flagBind;
  public callSubmit;

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private productSrvice: ProductserviceService,
    private _msupplyFormService: MsupplyFormRegistrationService,
    private toastService: ToastService
  ) {
  }

  ngOnInit() {
    debugger;
    this.disableCode = false;
    
    try {
      console.log("mydata1122")
    console.log(this.product);
    this.preBrandId = this.product.brand._id;
    this.preProductTypeId = this.product.type._id
    
    if(this.product.dimension == undefined){
      this.product.dimension = new ProductDimension();
      
    }
    if(this.product.code != undefined){
      this.disableCode=true;
    }
    else{
      this.product.statusChecked = true;

    }
    } catch (error) {
      this.toastService.error('Incorrect Data.Contact Admin');
      this.activeModal.close();
    }
    
  }
  ngAfterViewChecked() {
    //debugger;
    if(this.product.code != undefined){
      //this.disableCode=true;
      if(this.registrationForm.controls["logoUpload"] !=undefined){
        this.registrationForm.controls["logoUpload"].status = "VALID";
      }
      
    }
    
  }

  addEditProduct() {
    console.log(this.product);
    if(!this.validateForm()){
      return;


    }
    if(this.product.imageUrl == null){
      this.toastService.error("Please Upload Image");
      return;

    }
    if(this.product.brand._id == "0" && this.product.type._id == "0"){
      this.flagBind=true;
      this.addNewProductType();
     

    }
    else if(this.product.brand._id == "0" || this.product.type._id == "0"){
      if(this.product.type._id == "0" ){
        this.flagBind = false;
        this.addNewProductType();

      }
      else{
        this.flagBind=false;
        this.addNewBrand();

      }

    }
    else{
      this.Submit();
    }

    //this.loading = true;
    //this.product.imageUrl = "https://image3.mouthshut.com/images/imagesp/925839765s.jpg"

   
  }

public Submit(){
  if (this.product != null && this.product._id != null && this.product._id != "") {
    console.log(this.product)
    if(this.product.statusChecked){
      this.product.status = "Active";
    }
    else{
      this.product.status="Inactive";
    }
    this.productSrvice.updateProduct(this.product).subscribe(res => {
      console.log(res);
      this.loading = false;
      if (!res.isValid) {
        console.log(res.errors[0])
        this.toastService.error(res.errors[0]);
        //this.toastService.error('Error in updating Product.Please contact Admin');
      } else {
        this.toastService.success("Product updated!");
        this.activeModal.close('Close click');
      }
      
    })
  } else {
    console.log("craeted")
    if(this.product.statusChecked){
      this.product.status = "Active";
    }
    else{
      this.product.status="Inactive";
    }
    //this.product = new Product();
    this.product.manufacturer = new Manufacturer();
    this.product.manufacturer._id = this.manufacturerId;
    this.productSrvice.createProduct(this.product).subscribe(res => {
      console.log(res);
      this.loading = false;

      if (!res.isValid) {
        console.log(res.errors[0]);
        this.toastService.error(res.errors[0]);
        //this.toastService.error('Error in updating Product.Please contact Admin');
      } else {
        this.toastService.success("Product created!");
        this.activeModal.close('Close click');
      }
      
    })
  }
}
  //#region Other click handlers

  validateProductType(){
    if(this.productType != undefined && this.productType != null && this.productType != "" && (/\S/.test(this.productType))){
      return true;
    }
    return false;
  }

  addNewProductType(): void {
    if (this.validateProductType()) {
      this.productSrvice.createProductType(this.productType)
        .subscribe(
          data => {
            let response: ProductTypeResponseModel = { ...data };
            if (!response.isValid) {
              this.toastService.error(response.errors[0]);
              //this.toastService.error('Issue in creating New Product Type.Please contact Admin');
            }
            else{
              this.toastService.success(`New Product Type ${this.productType} is created!`);
              this.productTypes.push(response.data);
              this.product.type._id = response.data._id;
              this.productType = "";
              if(this.flagBind){
                this.addNewBrand();
  
              }
              else{
                this.Submit();
              }
            }
            
          },
          error => {
            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
          }
        );
    }
    else {
      this.toastService.success(`Please enter product type.`);
    }
  }

  validateBrand(){
    if(this.brand != undefined && this.brand != null && this.brand != "" && (/\S/.test(this.brand))){
      return true;
    }
    return false;
  }

  initialisePrevBrand(){
    this.product.brand._id = this.preBrandId;
  }

  initialisePrevProductType(){
    this.product.type._id = this.preProductTypeId;
  }

  addNewBrand(): void {
    if (this.validateBrand()) {
      this.productSrvice.createBrand(this.brand)
        .subscribe(
          data => {
            let response: BrandResponseModel = { ...data };
            if (!response.isValid) {
              this.toastService.error(response.errors[0]);
              //this.toastService.error('Issue in creating New Product Type.Please contact Admin');
            }
            else{
              this.toastService.success(`New Brand ${this.brand} is created!`);
              this.brands.push(response.data);
              this.product.brand._id = response.data._id;
              this.brand = "";
              this.Submit();
            }
           
            
          },
          error => {
            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
          }
        );
    }
    else {
      this.toastService.error(`Please enter Brand.`);
    }
  }

  //#endregion

  /**
 * Comment for method fileSelect.
 * @param target  Comment for parameter ´target´.
 * @returns       Comment for return value.
 */
  fileSelect(images: FileList, name: string) {
    var result = '';
    var file = images[0];
    debugger;
    //for (var i = 0; file = images[i]; i++) {
    // if the file is not an image, continue
    if (!this.validateFiles(name, file)) {
      if (!this.isImageValid) {
        this.toastService.error('File  should be an Image');
        //alert("File  should be an Image");
      }
      else {
        this.toastService.error('File Size should be less then 5 MB');
        //alert("File Size should be less then 5 MB");

      }
      return;

    }
    let reader = new FileReader();
    reader.onload = (function (tFile) {
      return function (evt) {
        var div = document.createElement('div');
        div.innerHTML = '<img style="width: 110px;height:110px" src="' + evt.target.result + '" />';
        document.getElementById(name).innerHTML = "";
        document.getElementById(name).appendChild(div);
      };
    }(file));
    this._msupplyFormService.postMsupplyFiles(file, name).subscribe(data => {
      if (name == "photo1") {
        this.product.imageUrl = data.url;

      }
      this.toastService.success('File Uploaded Successfully');
    },
      err => {
        this.toastService.error('Error in uploading File.Please contact Admin');
        console.log(err);
      }
    );
    reader.readAsDataURL(file);
    //this._awsupload.uploadfile(file);
    //}

  }

  /**
   * Comment for method fileSelect.
   * @param target  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
  validateFiles(name: string, file: File): boolean {
    if (name == "photo1") {
      if (!file.type.match('image.*')) {

        this.isImageValid = false;
        return false;
      }
      else {
        this.isImageValid = true;

      }
      if (file.size > 5000000) {
        this.isImageValid = false;

        return false;

      }
      else {
        this.isImageValid = true;

      }

    }
    return true;
  }

validateForm(){
  debugger;
  if(!this.registrationForm.form.valid){
    this.toastService.error('Please fill all the required details in Form');
    return false;

  }
  return true;
}
  //#region Error handler
  private checkUnauthorized(handledError: HandledErrorResponse): void {
    this.toastService.error(handledError.message);

    if (handledError.code == 401) {
      AuthService.logout();
      this.router.navigate(['/login']);
    }
  }
  //#endregion

}
