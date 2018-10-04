import { Component, OnInit,Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { BuyerProductPriceZoneCopyComponent } from './../buyer-product-price-zone-copy/buyer-product-price-zone-copy.component'
import { Product, ProductsData } from '../../models/Product';
import { PricingZone } from './../../models/pricing/PricingZone'
import { DeliveryAddress } from './../../models/DeliveryAddress'
import { CompanyBasicDetails }  from '../../models/CompanyBasicDetails'
import { BuyerProductsRequest } from '../../models/buyers/buyerProductsRequest';
import { BuyerProduct } from '../../models/buyers/buyerProduct';
import { ToastService } from '../../shared/services/toast/toast.service';
import { BuyerService } from '../../services/buyers/buyer.service';


@Component({
  selector: 'app-buyer-product-price-zone-mapping',
  templateUrl: './buyer-product-price-zone-mapping.component.html',
  styleUrls: ['./buyer-product-price-zone-mapping.component.css']
})
export class BuyerProductPriceZoneMappingComponent implements OnInit {
  
  @Input() product : Product; 
  @Input() pricingZones : PricingZone[];
  @Input() manufacturerProducts : ProductsData; 
  @Input() buyer : CompanyBasicDetails;
  addressZoneMapping : any [];
  selectedPriceZone: string[];
  public loading: boolean;
  public finalProd:BuyerProduct[];
  public disableCopy:boolean;
  public disableLink:boolean=true;

  
  //@Input() deliveryAddresses : DeliveryAddress[] TODO 
  DeliveryAddress : any []

  constructor(public activeModal: NgbActiveModal,
    private  modalService: NgbModal,
    private toast: ToastService,
    private buyerService: BuyerService) { }

  ngOnInit() {
    this.disableCopy = true;
    try {
      debugger;
      console.log(this.buyer)
      this.DeliveryAddress = this.buyer.deliveryAddresses;
      this.selectedPriceZone = new Array<string>();
       this.addressZoneMapping = new Array<any>();
      // if(this.pricingZones !=undefined && this.pricingZones !=null){
      //   this.pricingZones = this.pricingZones.filter(item=> item.manufacturer == this.product.manufacturer._id)
      // }
      //this.mapZoneToDeliveryAddress();
    } catch (error) {
      this.toast.error('Issue in loading details.Please contact Admin');
    this.activeModal.close();
    }
   
    this.mapZoneToDeliveryAddress();
  }
mapZoneToDeliveryAddress(){
  try {
   
    let filterProd = this.buyer.products.filter(item => item.product == this.product._id)[0];
    //this.addressZoneMapping = filterProd.addressZoneMapping;
      if(this.DeliveryAddress !=null && this.DeliveryAddress !=undefined){
        this.DeliveryAddress.forEach(item=> {
          let adrZoneMappingItem =  {
            "deliveryAddressId": item._id,
            "pricingZone": ''
            };
          item.mappedZoneId=null;
          if(filterProd != null){
            let mapZone = filterProd.addressZoneMapping.filter(ele => ele.deliveryAddressId == item._id)[0];
         if(mapZone !=null && mapZone !=undefined) {
         item.mappedZoneId =mapZone.pricingZone;
         adrZoneMappingItem.pricingZone = mapZone.pricingZone;
        
          
         this.disableCopy=false;
         }
         else{
          //this.disableCopy = true;
         }
          }
          else{
            this.disableCopy=true;
          }
          this.addressZoneMapping.push(adrZoneMappingItem);
         
        });
      }
      else{

      }
     
    //}
  } catch (error) {
    this.toast.error('Issue in loading details.Please contact Admin');
    this.activeModal.close();
  }
  debugger;
}
  

  BuyerProductCopyPriceZone(){
    
    const modalRef = this.modalService.open(BuyerProductPriceZoneCopyComponent, {size:'lg'});
    // let product = new Product();
    // product.category = new ProductCategory();
    // product.subCategory = new ProductSubCategory();
    // product.brand = new Brand();
    // product.type = new ProductType();
    // product.dimension = new ProductDimension();

    modalRef.componentInstance.product = this.product;
    modalRef.componentInstance.manufacturerProducts = this.manufacturerProducts;
    modalRef.componentInstance.addressZoneMapping = this.addressZoneMapping;
    modalRef.componentInstance.buyer = this.buyer;
    // //product.manufacturer ="5b393b7cf6ef9728bed19ead"; //TODO 
    // modalRef.componentInstance.product = product;
    // modalRef.componentInstance.categories = this.ProductData.categories;
    // modalRef.componentInstance.subCategories = this.ProductData.subCategories;
    // modalRef.componentInstance.productTypes = this.ProductData.productTypes;
    // modalRef.componentInstance.brands = this.ProductData.brands;
    modalRef.result.then(result=> 
    {
      debugger;
      // console.log("RESULT TESTINg");
      // console.log(result);
      // var data = { 
      //   'addZoneCopyProductList': result,
      //    'addressZoneMappingList': this.addressZoneMapping
      //   };
      //this.activeModal.close(data)
    });
  }

  MapPrizeZoneToDLAddress(dlAdrsIndex, selectedPricingZoneId){
    
    console.log("MAping1222");
    console.log(dlAdrsIndex);
    debugger;
    console.log(selectedPricingZoneId)
    console.log(this.DeliveryAddress[dlAdrsIndex]);
    let adrZoneMappingItem =  {
      "deliveryAddressId": this.DeliveryAddress[dlAdrsIndex]._id,
      "pricingZone": selectedPricingZoneId
      };

    this.addressZoneMapping[dlAdrsIndex] = adrZoneMappingItem;
    this.disableLink=false;
    console.log(this.addressZoneMapping);
  }

  LinkPrizeZoneToDLAddressClick(){
    var data = { 
      'addZoneCopyProductList': [],//excluding link price zone clicked product
      'addressZoneMappingList': this.addressZoneMapping
      };
    this.updateAdrPriceZoneToProduct();
  }

  public updateAdrPriceZoneToProduct() : void { 
    debugger;
    //TODO
    console.log("LINK Update");
    console.log(this.addressZoneMapping);
    console.log(this.product);

    let buyerProductsModel: BuyerProductsRequest = new BuyerProductsRequest();
    buyerProductsModel._id = this.buyer._id;
    buyerProductsModel.products = [];
    
    this.manufacturerProducts.products.forEach(productItem => {
      if (productItem.isChecked) {
        let buyerProduct = new BuyerProduct();
        let prod = this.buyer.products.filter(ele=> ele.product == productItem._id)[0];
        if(prod != null){
          
          buyerProduct.addressZoneMapping = prod.addressZoneMapping;
          buyerProduct.product=prod.product;

        }
        else{
          
          buyerProduct.product = productItem._id;
        }

        //only map zone to clicked product
        if(productItem._id == this.product._id){
          this.addressZoneMapping = this.addressZoneMapping.filter(item=> item.pricingZone != "");
          buyerProduct.addressZoneMapping = this.addressZoneMapping;
        }
        
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

    this.loading = true;
    this.buyerService.updateProducts(buyerProductsModel).subscribe(res => {
        this.loading = false;
        if (!res.isValid) {
            this.toast.error(res.errors[0])
            return;
        }
        // res.data.products.forEach(item => {
        //   let checkProd = this.buyer.products.filter(ele=> ele.product == item.product)[0];
        //   if(checkProd != null )
        //   checkProd.addressZoneMapping = item.addressZoneMapping;
        //   else{
        //     this.buyer.products.push(item);
        //   }
        // })
        let locObj = this.buyer.deliveryAddresses;

        this.buyer = res.data;
        this.buyer.deliveryAddresses = locObj;
        //this.buyer = res.data;
        console.log("busyer linked");
        console.log(res.data);
        this.disableCopy=false;
        //this.mapBuyerManufactorerProducts();
        this.toast.success("Buyer Products updated with price zones!")
    })

  }

}
