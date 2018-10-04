import { Component, OnInit, Input } from '@angular/core';
import { Product, ProductsData } from '../../models/Product';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { CompanyBasicDetails }  from '../../models/CompanyBasicDetails'
import { BuyerProductsRequest } from '../../models/buyers/buyerProductsRequest';
import { BuyerProduct } from '../../models/buyers/buyerProduct';
import { ToastService } from '../../shared/services/toast/toast.service';
import { BuyerService } from '../../services/buyers/buyer.service';

@Component({
  selector: 'app-buyer-product-price-zone-copy',
  templateUrl: './buyer-product-price-zone-copy.component.html',
  styleUrls: ['./buyer-product-price-zone-copy.component.css']
})
export class BuyerProductPriceZoneCopyComponent implements OnInit {

  @Input() product : Product; 
  @Input() manufacturerProducts : ProductsData; 
  @Input() addressZoneMapping : any;
  @Input() buyer : CompanyBasicDetails;
  manufacturerProductsBackUp:ProductsData;
filterBackUpList : ProductsData;
  //extra items added to avoid the build failed errors
  selectedCategory :string;
  selectedSubCategory:string;
  selectedBrand:string;
  selectedProductType:string;
  filterObject={
    catId:'All',
    prodType:'All',
    brand:'All',
    subCat:'All'
  }
  selectAllProducts:boolean;
  public loading: boolean;

  constructor(public activeModal: NgbActiveModal,
    private toast: ToastService,
    private buyerService: BuyerService) {
     
     }

  ngOnInit() {
    try {
      console.log(this.manufacturerProducts);
    this.manufacturerProductsBackUp = new ProductsData();
    this.manufacturerProductsBackUp.products = new Array<Product>();
      this.manufacturerProducts.products.forEach(item => {
        let objProd = new Product();
        objProd._id = item._id;
        objProd.category = item.category;
        objProd.subCategory = item.subCategory;
        objProd.brand = item.brand;
        objProd.name=item.name;
        objProd.type=item.type;
        objProd.uom=item.uom;
        objProd.manufacturer=item.manufacturer;
        objProd.gradeOrSpec=item.gradeOrSpec;
        objProd.status=item.status;
          //objProd = item;
          objProd.isChecked=false;
          if(item._id != this.product._id){
        this.manufacturerProductsBackUp.products.push(objProd);
          }
              
        
            });
    } catch (error) {
      this.toast.error('Error in copying.Please contact admin');
      this.activeModal.close('Click close');
    }
    
    //this.manufacturerProductsBackUp = this.manufacturerProducts;
    //this.manufacturerProducts.products = this.manufacturerProducts.products.filter(item => item._id != this.product._id);
    //this.manufacturerProductsBackUp.products = this.manufacturerProducts.products.filter(item => item._id != this.product._id);
    //this.filterBackUpList=this.manufacturerProductsBackUp;
    this.filterBackUpList = JSON.parse(JSON.stringify(this.manufacturerProductsBackUp));
  }
  filter(){
    debugger;
    //this.ManagecheckBoxSelectAll(false);
    //this.manufacturerProductsBackUp=this.filterBackUpList;
    this.filterBackUpList.products.forEach(item=> {
      item.isChecked = false;
    });
    this.manufacturerProductsBackUp = JSON.parse(JSON.stringify(this.filterBackUpList));
    if(this.filterObject.catId != "All"){
      //this.mappedProductList=this.backupProductList;
      this.manufacturerProductsBackUp.products = this.manufacturerProductsBackUp.products.
  filter(item=>item.category._id == this.filterObject.catId ); 
    }
    if(this.filterObject.brand != "All"){
      //this.mappedProductList=this.backupProductList;
      this.manufacturerProductsBackUp.products = this.manufacturerProductsBackUp.products.
      filter(item=>item.brand._id == this.filterObject.brand );
  
    }
    
    if(this.filterObject.prodType != "All"){
     // this.mappedProductList=this.backupProductList;
      this.manufacturerProductsBackUp.products = this.manufacturerProductsBackUp.products.
      filter(item=>item.type._id == this.filterObject.prodType );
  
    }
    if(this.filterObject.subCat != "All"){
      //this.mappedProductList=this.backupProductList;
      this.manufacturerProductsBackUp.products = this.manufacturerProductsBackUp.products.
    filter(item=>item.subCategory._id == this.filterObject.subCat );
  
    }
    
    if(this.filterObject.brand == "All" && this.filterObject.catId=="All" && this.filterObject.prodType=="All" && this.filterObject.subCat == "All" ){
      this.manufacturerProductsBackUp=this.filterBackUpList;
    }
    
    
  }
  filterOnCategory(selectedCategory){

  }
  filterOnSubCategory(selectedSubCategory){

  }
  filterOnProductType(selectedProductType){

  }
  filterOnBrand(selectedBrand){
    
  }
  public selectAll(flag){
    debugger;
    if(flag){
        
        this.manufacturerProductsBackUp.products.forEach(productItem => {
            productItem.isChecked = true;
        });
        //this.selectedCount = this.manufacturerProducts.products.length;
    }
    else{
        this.manufacturerProductsBackUp.products.forEach(productItem => {
            productItem.isChecked = false;
        });
        //this.selectedCount = 0;
    }

}

  CopyAdrZoneToProducts(){
    debugger;
    let buyerProductsModel: BuyerProductsRequest = new BuyerProductsRequest();
    buyerProductsModel._id = this.buyer._id;
    buyerProductsModel.products = [];
    let prod = this.buyer.products.filter(ele=> ele.product == this.product._id)[0];
   
    if(prod != null){
      let slectedProd = new BuyerProduct();
      slectedProd.product = prod.product;
      slectedProd.addressZoneMapping = prod.addressZoneMapping;
      buyerProductsModel.products.push(slectedProd);
    }
    this.manufacturerProductsBackUp.products.forEach(productItem => {
     
      if (productItem.isChecked )  {
        let buyerProduct = new BuyerProduct();
         
        if(prod != null){
          
          buyerProduct.addressZoneMapping = prod.addressZoneMapping;
          buyerProduct.product=productItem._id;

        }
        else{
          
          buyerProduct.product = productItem._id;
        }

        //only map zone to clicked product
        
        
        buyerProductsModel.products.push(buyerProduct);
      }else{
        //TODO case if link zone clicked but product is not marked checked
      }
    });
    this.manufacturerProducts.products.forEach(productItem => {
      let flag = buyerProductsModel.products.find(item=> item.product == productItem._id);
      if (productItem.isChecked && flag == undefined) {
        let buyerprod = this.buyer.products.filter(elem=> elem.product == productItem._id)[0];
        let buyerProduct = new BuyerProduct();
         
        if(buyerprod != null){
          
          buyerProduct.addressZoneMapping = buyerprod.addressZoneMapping;
          buyerProduct.product=buyerprod.product;

        }
        else{
          
          buyerProduct.product = productItem._id;
        }

        //only map zone to clicked product
        
        
        buyerProductsModel.products.push(buyerProduct);
      }else{
        //TODO case if link zone clicked but product is not marked checked
      }
    });

    //Add remaining Item from the this.buyer list from other manufacturers also

    this.buyer.products.forEach(buyerItem => {
      let check = buyerProductsModel.products.filter(bmodel=> bmodel.product == buyerItem.product)[0];
      if(check == null){
      buyerProductsModel.products.push(buyerItem);
      }
          });

  //   this.manufacturerProducts.products.forEach(product => {
  //     if (product.isChecked) {
  //         let buyerProduct = new BuyerProduct();
  //         buyerProduct.product = product._id;
  //         buyerProduct.addressZoneMapping = this.addressZoneMapping;
  //         buyerProductsModel.products.push(buyerProduct);
  //     }else{
  //       //TODO what about unchecked product...should we link zone or not
  //     }
  // });

    this.loading = true;
    this.buyerService.updateProducts(buyerProductsModel).subscribe(res => {
        this.loading = false;
        if (!res.isValid) {
            this.toast.error(res.errors[0])
            return;
        }
res.data.products.forEach(item => {
          let checkProd = this.buyer.products.filter(ele=> ele.product == item.product)[0];
          if(checkProd != null )
          checkProd.addressZoneMapping = item.addressZoneMapping;
          else{
            this.buyer.products.push(item);
          }
          let manSel = this.manufacturerProducts.products.filter(data=> data._id == item.product)[0];
          if( manSel !=null ){
            manSel.isChecked=true;

          }
         
        })
        //this.buyer = res.data;
        console.log("busyer saved");
        console.log(this.buyer.products);
        //this.mapBuyerManufactorerProducts();
        this.toast.success("Buyer Products updated with price zones!");
        this.activeModal.close('Cross click');
    })
  }
}
