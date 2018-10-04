import { Component, OnInit } from '@angular/core';
import {ManufacturerPriceMapping } from '../../models/ManufacturerPriceMapping';
import { ZonePrice,pricingZone} from '../../models/ZonePrice';
import { Product } from '../../models/Product';
import { Zone } from '../../models/Zone';
import {MsupplyproductpricingService } from '../../services/msupplyproductpricing.service'
import { retry } from 'rxjs/internal/operators/retry';
import { MSupplyCommonDataService } from '../../services/m-supply-common-data.service';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { EditPriceManufacturerComponent} from '../edit-price-manufacturer/edit-price-manufacturer.component'
import { CopyProductPriceManufacturerComponent } from '../copy-product-price-manufacturer/copy-product-price-manufacturer.component';
import { Brands } from '../../models/Brands';
import { ProductType } from '../../models/ProductType';
import { Subcategories } from '../../models/Subcategories';
import { min } from 'rxjs/internal/operators/min';
import { AddZoneInPricingComponent } from '../add-zone-in-pricing/add-zone-in-pricing.component';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { Router } from '@angular/router';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { ProductserviceService } from '../../services/productservice.service';
import { Utils } from '../../shared/helper/utils';

@Component({
  selector: 'app-price-from-manufacturer',
  templateUrl: './price-from-manufacturer.component.html',
  styleUrls: ['./price-from-manufacturer.component.css']
})
export class PriceFromManufacturerComponent implements OnInit {
  public loading = false;
  priceMappingList:ManufacturerPriceMapping[];
 
  filteredProuctMappingList:Array<Product>;
  mappedProductList:Array<Product>;
  backupProductList:Array<Product>;
  productList:Array<Product>;
  zoneList:Array<Zone>;
  gstRates:number[];
  brandList:Array<Brands>;
  manufacturerList:any;
  productType:Array<ProductType>;
  subcategoriesList:Array<Subcategories>;
  filterObject={
    manuId:'',
    prodType:'',
    brand:'',
    subCat:''
  }
  test:any;
  displayProductDetails:boolean;
  manuFirstSelection:boolean;
  restrictedValue:number;
  minRange:string;
  maxRange:string;

//For Pagination
pageStart:number =0 ;
pageEnd:number = 10;
pageSelected:number=1;
pageSize = 10;
totalActiveProduct:number = 0;
errMsgSeq:boolean = true;
//disbaleAddPrice=false;
pricingHistoryList:Array<ManufacturerPriceMapping>;


public inrFormatter = Utils.formatAmountInINR;

  constructor(private _productPricing:MsupplyproductpricingService,
    private _commonServices:MSupplyCommonDataService,private  modalService: NgbModal,
    private productSrvice: ProductserviceService,
    private toast:ToastService,
    private router: Router) {
      this.priceMappingList = new Array<ManufacturerPriceMapping>();
      // priceMappingList:Array<ManufacturerPriceMapping>;
       this.filteredProuctMappingList=new Array<Product>();
       
       this.productList=new Array<Product>(); 
    this.mappedProductList=new Array<Product>();
    this.gstRates=_commonServices.getGSTRates();
    this.subcategoriesList=new Array<Subcategories>();
    this.productType=new Array<ProductType>();
    this.brandList=new Array<Brands>();
    this.backupProductList=new Array<Product>();
    this.displayProductDetails=true;
    this.manuFirstSelection = true;
    let currentDate=new Date();
    this.minRange=new Date().toJSON().split('T')[0];
    

  }

  

  ngOnInit() {
    this.loading =true;
    this.productList=new Array<Product>();
    this._productPricing.getProducts().subscribe(data=> 
      {
        //this.loading = false;
        //debugger;
        //this.productList=data;
        this.initiateProducts(data);
        this.initiateZone(data.data.priceZones);
        //this.initiateBrand(data.data.brands);
        //this.initiateProductType(data.data.productTypes);
        //this.initiateSubcategories(data.data.subCategories);
        this._productPricing.getProductsPricing().subscribe(pricing=> {
          //debugger;
          this.initatePriceMappingList(pricing);
          this._productPricing.getAllManufacturersWithCategories().subscribe(manu=>{
            debugger;
            this.loading = false;
            this.manufacturerList=new Array<any>();
            this.manufacturerList=manu.data.manufacturers;
            this.manufacturerList.sort();
            this.mapProductsToPriceMappingList();
          },
          error => {
            this.loading = false;
            
            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
            this.checkUnauthorized(handledError);
          }
        )
          //this.priceMappingList = pricing;
          console.log(this.priceMappingList);

         
        },
        error => {
          this.loading = false;
          
          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
          this.checkUnauthorized(handledError);
        }
      );
        console.log(this.productList);
      },
      error => {
        this.loading = false;
        
        let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
        this.checkUnauthorized(handledError);
      }
      
    );

  }
  ngAfterViewInit(){
   
  }
  initiateProducts(productDetails){
    //debugger;
this.productList=productDetails.data.products;
  }
  initatePriceMappingList(priceMappingData){
    //debugger;
    this.priceMappingList = priceMappingData.data;
  }
initiateZone(data){
  this.zoneList=new Array<Zone>();
  this.zoneList= data;
  //this.zoneList= data.data;
}
initiateProductType(productData){
  this.productType=new Array<ProductType>();
  this.productType=productData;
  //this.productType=productData.data;
}
initiateSubcategories(subCategoryData){
  this.subcategoriesList=new Array<Subcategories>()
//this.subcategoriesList=subCategoryData.data;
this.subcategoriesList=subCategoryData;

}
initiateBrand(brandData){
  this.brandList=new Array<Brands>();
  //this.brandList=brandData.data;
  this.brandList=brandData;
}
onPageChange(){
  this.pageStart = (this.pageSelected-1) * this.pageSize
  this.pageEnd = this.pageStart + this.pageSize;
  }
  getDateNewPricing(date:any):string{
    let start = date.split('-');
    start[2] = start[2].split('T')[0];
    let dateObj = (new Date(start[0],parseInt(start[1])-1,start[2]));
    dateObj.setDate(dateObj.getDate() + 1);
    //let result = dateObj.toJSON().split('T')[0];
    //dateObj = dateObj.add
    let month = (dateObj.getMonth() + 1).toString();
    let day = (dateObj.getDate()).toString();
    if(month.toString().length  == 1 ){
      month= "0" + month.toString();

    }
    if(day.toString().length ==1){
      day = "0" + day;
    }
    let result =  dateObj.getFullYear()  + "-" + month + "-" + day;
    //let result = dateObj.getFullYear()  + "-" + ((dateObj.getMonth() +1).toString()).length ==1 : ("0" +((dateObj.getMonth() +1).toString())) ? ((dateObj.getMonth() +1).toString()) + "-"+ 
    //((dateObj.getDate()).toString()).length == 1 ? ("0" + dateObj.getDate()) : (dateObj.getDate()).toString();
    //dateObj.getDate();dateObj.getMonth();
    //let result = start[0] + "-" + start[1] + "-"+ (parseInt(start[2]) + 1)
    return result;
  
  }

  copyGstRates(prodId:string){
    //debugger;
    let selectedProd = this.mappedProductList.filter(item=>item._id == prodId)[0];
    let prodGST=selectedProd.prodGST;
    selectedProd.manuFacturerPriceMapping.zonePrices.forEach(zoneItem=>{
      zoneItem.insuranceGst = prodGST;
      zoneItem.gst=prodGST;
      zoneItem.transportationGst=prodGST;
      zoneItem.wareHouseGst=prodGST;
      zoneItem.threePlGst=prodGST;
      zoneItem.loadingChargeGst=prodGST;
      zoneItem.unloadingChargeGst=prodGST;
      zoneItem.packagingChargeGst=prodGST;
      zoneItem.othersChargeGst=prodGST;
      this.CalculateLandingPrice('Fixed','Ex',prodId,zoneItem.pricingZone._id);
      this.RecalculateAll(prodId,zoneItem.pricingZone._id);
      // this.CalculateLandingPrice(zoneItem.CurrentSelectedI,'I',prodId,zoneItem.pricingZone._id);
      // this.CalculateLandingPrice(zoneItem.CurrentSelectedW,'W',prodId,zoneItem.pricingZone._id);
      // this.CalculateLandingPrice(zoneItem.CurrentSelectedT,'T',prodId,zoneItem.pricingZone._id);
      // this.CalculateLandingPrice(zoneItem.CurrentSelectedP,'3PL',prodId,zoneItem.pricingZone._id)
      // this.calculateTransportationFixedAmount(prodId,zoneItem.pricingZone._id,'gst');
      // this.calculateInsuranceCostFixedAmount(prodId,zoneItem.pricingZone._id,'gst');
      // this.calculate3PLCostFixedAmount(prodId,zoneItem.pricingZone._id,'gst');
      // this.calculateWareHouseFixedAmount(prodId,zoneItem.pricingZone._id,'gst');
      // this.calculateExFactoryPrice(prodId,zoneItem.pricingZone._id);
    });
  
  }
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
  openEditValidatity(prodId:any) {
    debugger;
    let dateRange;
    const modalRef = this.modalService.open(EditPriceManufacturerComponent,{size:'lg'});
    modalRef.componentInstance.name=prodId;
    let listProd=this.mappedProductList;
    modalRef.componentInstance.ProductList = listProd;
    modalRef.componentInstance.productPricingZone = this.priceMappingList;
    modalRef.result.then(result=> 
      {
        try {
          debugger;
        let currenProduct = this.mappedProductList.filter(item => item._id == result.product._id)[0];
        currenProduct.manuFacturerPriceMapping = this.priceMappingList.filter(data=> data._id == result._id)[0];
        currenProduct.manuFacturerPriceMapping.zonePrices = 
        currenProduct.manuFacturerPriceMapping.zonePrices.filter(zoneItem => zoneItem.pricingZone.isActive);
        currenProduct.validityStart=this.getDateFormat(this.priceMappingList.filter(data=> data._id == result._id)[0].validityStartTime);
        currenProduct.validityEnd=this.getDateFormat(this.priceMappingList.filter(data=> data._id == result._id)[0].validityEndTime);
        currenProduct.startTime = this.getTimeFormat(this.priceMappingList.filter(data=> data._id == result._id)[0].validityStartTime);
        currenProduct.endTime = this.getTimeFormat(this.priceMappingList.filter(data=> data._id == result._id)[0].validityEndTime);
        currenProduct.prodGST=null;
 
        this.mappedProductList.filter(item => item._id == result.product._id)[0].IsNewPricing=false;
        this.mappedProductList.filter(item => item._id == result.product._id)[0].IsSaveDisable=false;
     
       this.mappedProductList.filter(item => item._id == result.product._id)[0].manuFacturerPriceMapping.zonePrices.forEach(zonePrice => {
       
        // element.insuranceTotal=0;
        // element.transportationTotal=0;
        // element.threePLTotal=0;
        // element.wareHouseTotal=0;
        // element.loadingChargeTotal=0;
        // element.unloadingChargeTotal=0;
        // element.packagingChargeTotal=0;
        // element.othersChargeFixed=0;

        zonePrice.pricingZoneName=zonePrice.pricingZone.name;
        zonePrice.insuranceTotal=0;
        zonePrice.transportationTotal=0;
        zonePrice.threePLTotal=0;
        zonePrice.wareHouseTotal=0;
        zonePrice.packagingChargeTotal = 0;
        zonePrice.othersChargeTotal=0;
        zonePrice.loadingChargeTotal=0;
        zonePrice.unloadingChargeTotal=0;
        zonePrice.disableZone=false;
        //Test Details
       
      zonePrice.minimumOrderQuantity = zonePrice.minimumOrderQuantity;
       debugger;
        let result = this.IntializeTotalPrices(zonePrice.insuranceChargeFixed, zonePrice.insuranceChargeInPercentage, zonePrice.insuranceGst, zonePrice.exFactoryPrice);
        zonePrice.insuranceTotal = result.totalAmount;
        zonePrice.CurrentSelectedI=result.type;
      
         
        result = this.IntializeTotalPrices(zonePrice.transportationChargeFixed, zonePrice.transportationChargeInPercentage, zonePrice.transportationGst, zonePrice.exFactoryPrice);
        zonePrice.transportationTotal = result.totalAmount;;
        zonePrice.CurrentSelectedT = result.type;
        
        result = this.IntializeTotalPrices(zonePrice.threePlChargeFixed, zonePrice.threePlChargeInPercentage, zonePrice.threePlGst, zonePrice.exFactoryPrice);
        zonePrice.threePLTotal = result.totalAmount;
        zonePrice.CurrentSelectedP=result.type;
      
        
        result = this.IntializeTotalPrices(zonePrice.wareHouseChargeFixed, zonePrice.wareHouseChargeInPercentage, zonePrice.wareHouseGst, zonePrice.exFactoryPrice);
        zonePrice.wareHouseTotal = result.totalAmount;
        zonePrice.CurrentSelectedW = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.loadingChargeFixed, zonePrice.loadingChargeInPercentage, zonePrice.loadingChargeGst, zonePrice.exFactoryPrice);
        zonePrice.loadingChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedL = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.unloadingChargeFixed, zonePrice.unloadingChargeInPercentage, zonePrice.unloadingChargeGst, zonePrice.exFactoryPrice);
        zonePrice.unloadingChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedU = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.packagingChargeFixed, zonePrice.packagingChargeInPercentage, zonePrice.packagingChargeGst, zonePrice.exFactoryPrice);
        zonePrice.packagingChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedPC = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.othersChargeFixed, zonePrice.othersChargeInPercentage, zonePrice.othersChargeGst, zonePrice.exFactoryPrice);
        zonePrice.othersChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedO = result.type;
      }); 
        } catch (error) {
          
        }
        
       //dateRange=result;
      });
    
  }

  openPriceHistory(prodId:any,zoneId:any,manuPricingId:string,pricingZoneName:string) {

    debugger;
    if(manuPricingId != undefined){
      this._productPricing.getViewHistory(manuPricingId,zoneId).subscribe(result => {
        this.pricingHistoryList = result.data;
        const modalHistory = this.modalService.open(ViewHistoryComponent,{size:'lg'});
    
      modalHistory.componentInstance.name=prodId;
    
      //let historyList = this.pricingHistoryList.filter(item=> item.product._id == prodId);
    
      modalHistory.componentInstance.pricingHistoryList = this.pricingHistoryList;
      modalHistory.componentInstance.zoneId = zoneId;
      modalHistory.componentInstance.ProductList = this.mappedProductList;
      this.pricingHistoryList.forEach(item=> {
        if(item.updatedBy == undefined){
          item.updatedBy = item.createdBy;
        }
      })
      modalHistory.componentInstance.productPricingZone = this.pricingHistoryList;
      modalHistory.componentInstance.zoneName = pricingZoneName;
      },
      error => {
        //this.loading = false;
        
        let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
        this.checkUnauthorized(handledError);
      }
    );
    }
    else{
      this.toast.error("No Price History Avaliable");
    }
    
    
  
   
  
  }

  openCopyPrice(prodId:any){
    debugger;
    const modelCopy = this.modalService.open(CopyProductPriceManufacturerComponent,{size:'lg'});
    modelCopy.componentInstance.name=prodId;
    let listProd=this.mappedProductList;
    modelCopy.componentInstance.ProductList = listProd;
    modelCopy.componentInstance.manufacturerList=this.manufacturerList;
    modelCopy.componentInstance.subcategoriesList=this.subcategoriesList;
    modelCopy.componentInstance.productType=this.productType;
    modelCopy.componentInstance.brandList=this.brandList;
    modelCopy.componentInstance.mappedProductList=listProd;
    modelCopy.result.then(result=> 
      {
        debugger;
        for(let i=0;i < result.rateToCopiedProducts.length  ; i++){
          this.copySelectedProductsRate(result.currentProduct,result.rateToCopiedProducts[i]);
       console.log(result);

        }
        
        //dateRange=result;
      });
   // modalRef.componentInstance.productPricingZone = this.priceMappingList;
  }
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
openAddZone(prodId:any) {
  debugger;
  let dateRange;

  
  let selectedProd = this.mappedProductList.filter(item => item._id == prodId)[0];
  let selectedZones;
  
  

  //list of zones belonging to the selected manufacturer
  let manufacturerZoneList = this.zoneList.filter(item=> item.manufacturer ==this.filterObject.manuId );

  //list of zones belonging to the selected subcategory
  if(this.filterObject.subCat != '' && this.filterObject.subCat != 'All'){
    manufacturerZoneList = manufacturerZoneList.filter(item=> item.subCategory == this.filterObject.subCat);
  }
  manufacturerZoneList = manufacturerZoneList.filter(item=> item.isActive == true);
//List of already added zones in the product
if(selectedProd.manuFacturerPriceMapping != null){
  selectedZones = selectedProd.manuFacturerPriceMapping.zonePrices;
  for(let j=0; j< selectedZones.length ; j++){
    manufacturerZoneList = manufacturerZoneList.filter(item=> item._id != selectedZones[j].pricingZone._id)
      }

}
if(manufacturerZoneList.length == 0){
  selectedProd.disbaleAddPrice = true;
  this.toast.error("No Price zone defined for the manufacturer");
  return;
}
  //excluding the already selected zones from the list 
  const modalRef = this.modalService.open(AddZoneInPricingComponent,{size:'lg'});
  
  modalRef.componentInstance.name=prodId;

  modalRef.componentInstance.zoneList=manufacturerZoneList;
  //modalRef.componentInstance.added
  
  modalRef.result.then(result=> 
    {
      debugger;
     this.addNewZoneForProduct(result.prodId,result.zoneId);
     if(manufacturerZoneList.length  == 1){
      selectedProd.disbaleAddPrice=true;
     }
     else{
      selectedProd.disbaleAddPrice=false;

     }
     
    });
}


addNewZoneForProduct(prodId:string,zoneId:string){
  let prodSelected = this.mappedProductList.filter(item=> item._id == prodId)[0];
prodSelected.IsSaveDisable=false
  //get the selected zone from the zone list 
  let item = this.zoneList.filter(item=> item._id == zoneId)[0];

  //Create new ZonePrice object to push the details into the manufacturer pricing, zonePrice array 
  let zoneItem = new ZonePrice();
  //Create an price zone object 
        let priceZone = new pricingZone();
        priceZone._id=item._id;
        priceZone.isActive=item.isActive;
        priceZone.name=item.name;
        //Assigning price zone to zoneitem Object 
        zoneItem.pricingZone=priceZone;
        zoneItem.basicPrice=0;
  zoneItem.exFactoryPrice=0;
  zoneItem.gst=0;
  zoneItem.disableZone=true;
zoneItem.insuranceChargeFixed=0;
  zoneItem.insuranceChargeInPercentage=0;
  zoneItem.insuranceTotal=0;
  zoneItem.insuranceGst=0;
  
  zoneItem.transportationChargeFixed=0;
  zoneItem.transportationChargeInPercentage=0;
  zoneItem.transportationGst=0;
  zoneItem.transportationTotal=0;
  
  zoneItem.wareHouseChargeFixed=0;
  zoneItem.wareHouseGst=0;
  zoneItem.wareHouseTotal=0;
  zoneItem.wareHouseChargeInPercentage=0;
  
  zoneItem.threePlChargeFixed=0;
  zoneItem.threePLTotal=0;
  zoneItem.threePlGst=0;
  zoneItem.threePlChargeInPercentage=0;

  zoneItem.loadingChargeFixed = 0;
  zoneItem.loadingChargeInPercentage=0;
  zoneItem.loadingChargeGst=0;
  zoneItem.loadingChargeTotal = 0 ;

  zoneItem.unloadingChargeFixed =0 ;
  zoneItem.unloadingChargeInPercentage=0;
  zoneItem.unloadingChargeGst=0;
  zoneItem.unloadingChargeTotal=0;

  zoneItem.packagingChargeFixed=0;
  zoneItem.packagingChargeInPercentage=0;
  zoneItem.packagingChargeGst=0;
  zoneItem.packagingChargeTotal=0;

  zoneItem.othersChargeFixed=0;
  zoneItem.othersChargeInPercentage=0;
  zoneItem.othersChargeGst=0;
  zoneItem.othersChargeTotal=0;
zoneItem.landingPrice=0;
zoneItem.isAddedNow=true;

  //Push the created zoneItem to selected product manufacturere pricingzone price items array
  prodSelected.manuFacturerPriceMapping.zonePrices.push(zoneItem);

}

//This section of intializing the manufacturer pricing and assisging the  product details need to handled in 
//Call it from mapproddetails method if the manufacturer price mapping is null
addNewManufacturerInProduct(prodId:string){
  // Get the selected product
  let prodSelected = this.mappedProductList.filter(item=> item._id == prodId)[0];
  //Flag this entry for create request
    prodSelected.IsNewPricing=true;
    //Initialize the Manufacturer Price mapping to bind it to product
    let newProductPricing = new ManufacturerPriceMapping();

    //Create a new product to bind it to manufacturer pricing 
    let bindProduct = new Product();
    bindProduct._id = prodSelected._id;

    //Assiging the product object to manufacturere prcing 
    newProductPricing.product = bindProduct;

    //Initialize the zone prices for Manufacturer pricing 
    newProductPricing.zonePrices = new Array<ZonePrice>();
    prodSelected.manuFacturerPriceMapping=newProductPricing
}
  copySelectedProductsRate(currentProdId:string,slectedProd:string){
    debugger;
    try {
      //this is product from data data need to be copied
      let prodList = this.mappedProductList;
      let baseProduct = prodList.filter(item=>item._id == currentProdId)[0];
    if(baseProduct != null){
      //for(let j=0;j < slectedProd.length; j++){
        //product on which data need to be copied
        let idProd = slectedProd;
        let ProductListData=this.mappedProductList;
        let productCopy = ProductListData.filter(data=> data._id == idProd)[0];
        productCopy.validityStart=baseProduct.validityStart;
        productCopy.validityEnd=baseProduct.validityEnd;
        try {
          if(productCopy.manuFacturerPriceMapping !=undefined && productCopy.manuFacturerPriceMapping.zonePrices !=undefined){
            if(productCopy.manuFacturerPriceMapping.zonePrices.length > 0){
              productCopy.IsNewPricing = false;

            }
            else{
              productCopy.IsNewPricing =true;

            }

          }
          else{
            productCopy.IsNewPricing = true;
          }
          
        } catch (error) {
          productCopy.IsNewPricing = true;
        }
        
        
        productCopy.startTime = baseProduct.startTime;
        productCopy.endTime=baseProduct.endTime;
        let objProdPricinng = new ManufacturerPriceMapping();
        objProdPricinng.zonePrices = new Array<ZonePrice>();
        objProdPricinng.product=productCopy.manuFacturerPriceMapping.product;
        objProdPricinng.validityEndTime = baseProduct.validityEnd;
        objProdPricinng.validityStartTime=baseProduct.validityStart;
        objProdPricinng._id = productCopy.manuFacturerPriceMapping._id;


        //iterate through each pricing zone of base product to get the data copied into the selected products
        for(let k=0 ; k < baseProduct.manuFacturerPriceMapping.zonePrices.length ; k++){
          let baseProductZone = baseProduct.manuFacturerPriceMapping.zonePrices[k];
          let zoneDatatoCopy = new ZonePrice();

          // let zoneDatatoCopy = productCopy.manuFacturerPriceMapping.zonePrices.
          // filter(zoneData=> zoneData.pricingZone._id == baseProductZone.pricingZone._id)[0];
          //if(zoneDatatoCopy !=null){
            try {
              zoneDatatoCopy.pricingZone=baseProductZone.pricingZone;
              zoneDatatoCopy.minimumRetailPrice=baseProductZone.minimumRetailPrice;
              zoneDatatoCopy.basicPrice=baseProductZone.basicPrice;
              zoneDatatoCopy.exFactoryPrice=baseProductZone.exFactoryPrice;
              zoneDatatoCopy.gst=baseProductZone.gst;

              zoneDatatoCopy.transportationChargeInPercentage=baseProductZone.transportationChargeInPercentage;
              zoneDatatoCopy.transportationChargeFixed=baseProductZone.transportationChargeFixed;
              zoneDatatoCopy.transportationGst=baseProductZone.transportationGst;
              zoneDatatoCopy.transportationTotal=baseProductZone.transportationTotal;

              zoneDatatoCopy.wareHouseChargeFixed=baseProductZone.wareHouseChargeFixed;
              zoneDatatoCopy.wareHouseChargeInPercentage=baseProductZone.wareHouseChargeInPercentage;
              zoneDatatoCopy.wareHouseGst=baseProductZone.wareHouseGst;
              zoneDatatoCopy.wareHouseTotal=baseProductZone.wareHouseTotal;

              zoneDatatoCopy.threePlChargeFixed=baseProductZone.threePlChargeFixed;
              zoneDatatoCopy.threePlChargeInPercentage=baseProductZone.threePlChargeInPercentage;
              zoneDatatoCopy.threePlGst=baseProductZone.threePlGst;
              zoneDatatoCopy.threePLTotal=baseProductZone.threePLTotal;

              zoneDatatoCopy.insuranceChargeFixed=baseProductZone.insuranceChargeFixed;
              zoneDatatoCopy.insuranceChargeInPercentage=baseProductZone.insuranceChargeInPercentage;
              zoneDatatoCopy.insuranceGst=baseProductZone.insuranceGst;
              zoneDatatoCopy.insuranceTotal=baseProductZone.insuranceTotal;

              zoneDatatoCopy.loadingChargeFixed=baseProductZone.loadingChargeFixed;
              zoneDatatoCopy.loadingChargeInPercentage=baseProductZone.loadingChargeInPercentage;
              zoneDatatoCopy.loadingChargeGst = baseProductZone.loadingChargeGst;
              zoneDatatoCopy.loadingChargeTotal = baseProductZone.loadingChargeTotal;

              zoneDatatoCopy.unloadingChargeFixed = baseProductZone.unloadingChargeFixed;
              zoneDatatoCopy.unloadingChargeInPercentage=baseProductZone.unloadingChargeInPercentage;
              zoneDatatoCopy.unloadingChargeGst=baseProductZone.unloadingChargeGst;
              zoneDatatoCopy.unloadingChargeTotal=baseProductZone.unloadingChargeTotal;

              zoneDatatoCopy.packagingChargeFixed=baseProductZone.packagingChargeFixed;
              zoneDatatoCopy.packagingChargeInPercentage = baseProductZone.packagingChargeInPercentage;
              zoneDatatoCopy.packagingChargeGst=baseProductZone.packagingChargeGst;
              zoneDatatoCopy.packagingChargeTotal=baseProductZone.packagingChargeTotal;

              zoneDatatoCopy.othersChargeFixed = baseProductZone.othersChargeFixed;
              zoneDatatoCopy.othersChargeInPercentage=baseProductZone.othersChargeInPercentage;
              zoneDatatoCopy.othersChargeGst = baseProductZone.othersChargeGst;
              zoneDatatoCopy.othersChargeTotal=baseProductZone.othersChargeTotal;
              zoneDatatoCopy.landingPrice=baseProductZone.landingPrice;
              zoneDatatoCopy.isAddedNow = zoneDatatoCopy.isAddedNow;

              let result = this.IntializeTotalPrices(zoneDatatoCopy.insuranceChargeFixed, zoneDatatoCopy.insuranceChargeInPercentage, zoneDatatoCopy.insuranceGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.insuranceTotal = result.totalAmount;
              zoneDatatoCopy.CurrentSelectedI=result.type;
            
               
              result = this.IntializeTotalPrices(zoneDatatoCopy.transportationChargeFixed, zoneDatatoCopy.transportationChargeInPercentage, zoneDatatoCopy.transportationGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.transportationTotal = result.totalAmount;;
              zoneDatatoCopy.CurrentSelectedT = result.type;
              
              result = this.IntializeTotalPrices(zoneDatatoCopy.threePlChargeFixed, zoneDatatoCopy.threePlChargeInPercentage, zoneDatatoCopy.threePlGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.threePLTotal = result.totalAmount;
              zoneDatatoCopy.CurrentSelectedP=result.type;
            
              
              result = this.IntializeTotalPrices(zoneDatatoCopy.wareHouseChargeFixed, zoneDatatoCopy.wareHouseChargeInPercentage, zoneDatatoCopy.wareHouseGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.wareHouseTotal = result.totalAmount;
              zoneDatatoCopy.CurrentSelectedW = result.type;
            
              result = this.IntializeTotalPrices(zoneDatatoCopy.loadingChargeFixed, zoneDatatoCopy.loadingChargeInPercentage, zoneDatatoCopy.loadingChargeGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.loadingChargeTotal = result.totalAmount;
              zoneDatatoCopy.CurrentSelectedL = result.type;
            
              result = this.IntializeTotalPrices(zoneDatatoCopy.unloadingChargeFixed, zoneDatatoCopy.unloadingChargeInPercentage, zoneDatatoCopy.unloadingChargeGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.unloadingChargeTotal = result.totalAmount;
              zoneDatatoCopy.CurrentSelectedU = result.type;
            
              result = this.IntializeTotalPrices(zoneDatatoCopy.packagingChargeFixed, zoneDatatoCopy.packagingChargeInPercentage, zoneDatatoCopy.packagingChargeGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.packagingChargeTotal = result.totalAmount;
              zoneDatatoCopy.CurrentSelectedPC = result.type;
            
              result = this.IntializeTotalPrices(zoneDatatoCopy.othersChargeFixed, zoneDatatoCopy.othersChargeInPercentage, zoneDatatoCopy.othersChargeGst, zoneDatatoCopy.exFactoryPrice);
              zoneDatatoCopy.othersChargeTotal = result.totalAmount;
              zoneDatatoCopy.CurrentSelectedO = result.type;
              
              objProdPricinng.zonePrices.push(zoneDatatoCopy);


            } catch (error) {
              
            }
         // }

        }
        productCopy.manuFacturerPriceMapping = objProdPricinng;
        productCopy.IsSaveDisable = false;

     // }

    }
    } catch (error) {
      alert('Error in copying rates.Please contact admin')
      console.log('Error in copying rates');
    }
    

  }

  removeZone(prodId:string,zoneId:string){
    let prodSelected = this.mappedProductList.filter(item=> item._id == prodId)[0];

    prodSelected.manuFacturerPriceMapping.zonePrices= prodSelected.manuFacturerPriceMapping.zonePrices.filter(item=> item.pricingZone._id != zoneId);
    prodSelected.disbaleAddPrice=false;
  }
  /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
filterManufacturer(manufacturerId:string){
  if(manufacturerId == "All"){
    this.mappedProductList=this.backupProductList;

  }
  else{
    this.mappedProductList = this.mappedProductList.
filter(item=>item.manufacturer._id == manufacturerId );

  }
  this.displayProductDetails=false;

}
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
filterSubCategory(sunCatId:string){
 // alert(sunCatId);
  if(sunCatId == "All"){
    this.mappedProductList=this.backupProductList;

  }
  else{
    this.mappedProductList = this.mappedProductList.
  filter(item=>item.subCategory._id == sunCatId );
  }
  
  }

  /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
filterProductType(pordId:string){
  if(pordId == "All"){
    this.mappedProductList=this.backupProductList;

  }
  else{
    this.mappedProductList = this.mappedProductList.
  filter(item=>item.type._id == pordId );
  }
  
  }
   /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
filterBrand(brandId:string){
  if(brandId == "All"){
    this.mappedProductList=this.backupProductList;

  }
  else{
    this.mappedProductList = this.mappedProductList.
  filter(item=>item.brand._id == brandId );
  }
  
  }
  validateDateRange(productId : string,type:string):boolean{
    debugger;
    let productPricingItems;
    let selectedProduct = this.mappedProductList.filter(item=> item._id == productId)[0];
    let selectedManfacturerPricingId = selectedProduct.manuFacturerPriceMapping._id;
    if(type == "create"){
      productPricingItems = this.priceMappingList.filter(item=> item.product._id == productId);
    }
    else { 
      productPricingItems =this.priceMappingList.filter(item=> item.product._id == productId);
      //In update need to exclude the current range from the validation list.Else it will always fails during validation
      productPricingItems = productPricingItems.filter(item=> item._id != selectedManfacturerPricingId);
    }
     
    let selectedProd = this.mappedProductList.filter(item=> item._id == productId)[0];
    let selectedEnd = this.getDateValue(selectedProd.validityEnd);
    let selectedStart=this.getDateValue(selectedProd.validityStart);
    let result = true;
    for(let i=0;i<productPricingItems.length;i++ ){
      let prodItem = productPricingItems[i];
      result = this.checkProductDateRange(selectedStart,selectedEnd,prodItem.validityStartTime,prodItem.validityEndTime);
      if(!result){
        this.toast.error('Pricing Details Already defined for the selected period');
        //alert('Pricing Details Already defined for the selected period');
        return result;

      }
      

    }
   
    return result;

  }
  checkProductDateRange(selectedStart:Date,selectedEnd:Date,zoneStart,zoneEnd):boolean{
    
    zoneStart = this.getDateValue(zoneStart);
    zoneEnd=this.getDateValue(zoneEnd);
    let IsValid=true;

    if(selectedStart >= zoneStart && selectedStart <= zoneEnd){
      IsValid=false;

    }
    else if(selectedEnd >= zoneStart && selectedEnd <= zoneEnd){
      IsValid=false;
    }
    return IsValid;

  }

  getDateValue(date:any):Date{
    let start = date.split('-');
            let time = start[2].split('T')[1];
            start[2] = start[2].split('T')[0];
            let hour = 0;
            let minute = 0;
            let secs = 0;

            if (time != null) {
                let timeArray = time.split(":");
                if (timeArray[0] != null && timeArray[0] != undefined) {
                    hour = timeArray[0];
                }
                if (timeArray[1] != null && timeArray[1] != undefined) {
                    minute = timeArray[1];
                }
                if (timeArray[2] != null && timeArray[2] != undefined) {
                    secs = timeArray[2].split('.')[0];
                }
                
                 
            }
            
             
            let dateStart = new Date(parseInt(start[0]), (parseInt(start[1]) - 1), parseInt(start[2]),hour,minute,secs);
            return dateStart;
  }

  // getDateValue(date:any):Date{
  //   let start = date.split('-');
  //   start[2] = start[2].split('T')[0];
  //   let dateStart = new Date(parseInt(start[0]),(parseInt(start[1])-1),parseInt(start[2]));
  //   return dateStart;
 
  // }
  validate(prodId:string){
    debugger;
    //console.log(this.test);
    //alert(this.test);
    let clickedProduct = this.mappedProductList.filter(item=> item._id == prodId)[0];
    if(clickedProduct.validityEnd !="" ){
      if(clickedProduct.validityStart !=""){
        let start =clickedProduct.validityStart.split('-');
        let end = clickedProduct.validityEnd.split('-');
        let dateStart = new Date(parseInt(start[0]),(parseInt(start[1])-1),parseInt(start[2]));
        let dateEnd = new Date(parseInt(end[0]),(parseInt(end[1])-1),parseInt(end[2]));
        let currentDate = new Date(new Date().setHours(0,0,0,0));
        if(dateStart < currentDate){
          this.toast.error('Past dates are not allowed');
          //alert('Past dates are not allowed');
          clickedProduct.validityStart="";
        }
        if(dateEnd < dateStart){
          this.toast.error('End date should be greater then start date ');
         // alert('end date should be greater then start date ');
          clickedProduct.validityEnd="";

        }

      }

    }
  }
  SaveProduct(productId : string){
    //debugger;
    if(this.ValidateForm(productId)){
      let clickedProduct = this.mappedProductList.filter(item=> item._id == productId)[0];
        clickedProduct.manuFacturerPriceMapping.validityStartTime = clickedProduct.validityStart + "T" + clickedProduct.startTime + ":00.000Z";
        clickedProduct.manuFacturerPriceMapping.validityEndTime = clickedProduct.validityEnd + "T" + clickedProduct.endTime + ":00.000Z";;
        if(clickedProduct.validityStart == "" || clickedProduct.validityEnd=="" 
        || clickedProduct.startTime=="" || clickedProduct.endTime =="" 
        || clickedProduct.startTime == undefined || clickedProduct.endTime== undefined){
          this.toast.error('Provide Value for validity dates');
          //alert('Provide Value for validity dates');
          return;
  
        }
      if(clickedProduct.IsNewPricing){

        if(this.validateDateRange(productId,"create")){
          debugger;
          this.loading=true;
          this._productPricing.createManufacturerPricingZone(clickedProduct.manuFacturerPriceMapping).
        subscribe(result=> {
          this.loading =false;
          debugger;
          if(result.errors !=null){
            this.toast.error(result["errors"][0]);
            //this.toast.error('Error in Saving Details.Please contact admin');
            //alert("Error in Saving Details.Please contact admin");
            console.log(result.error);
          }
          else if(result.error !=undefined && result.error !=null){
            //this.toast.error(result["errors"][0]);
            this.toast.error(result.error);
            //alert(result.error);
            console.log(result.error);

          }
          else{
            debugger;
            result.data.product = clickedProduct;
            clickedProduct.IsNewPricing = false;
            this._productPricing.getProductPrice(result.data._id).subscribe(value => 
              {
                this.priceMappingList.push(value.data);
                clickedProduct.manuFacturerPriceMapping = value.data;
               
                clickedProduct.latestPriceId=this.getProductLatestRange( this.priceMappingList.
                  filter(item=> item.product._id == productId));
              },
              err=> {
                this.loading =false;
              }
            );
  
            clickedProduct.manuFacturerPriceMapping.zonePrices.forEach(item=>{
              if(item.isAddedNow != undefined){
                item.isAddedNow = false;
              }
            });
            
              this.toast.success('Details saved Successfully');
            //alert('Details saved Successfully');
          }
          console.log(result)
        },
        err=> {
          this.loading =false;
          //alert("Error in Saving Details.Please contact admin");
          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...err});
          this.checkUnauthorized(handledError);
          console.log(err);
        }
      );

        }
        


      }
      else{
        debugger;
        if(!this.validateDateRange(productId,"update")){
          return ;

        }  
        this.loading =true;
        this._productPricing.updateManufacturerPricingZone(clickedProduct.manuFacturerPriceMapping).
        subscribe(result=> {
          this.loading =false;
          console.log(result);
          if(result.errors !=null){
            this.toast.error(result["errors"][0]);
            //this.toast.error('Error in Saving Details.Please contact admin');
            //alert("Error in Saving Details.Please contact admin");
          }
          else if(result.error !=undefined && result.error !=null){
            this.toast.error(result["errors"][0]);
            //this.toast.error('Error in Saving Details.Please contact admin');
            //alert(result.error);
            console.log(result.error);

          }
          else{
            clickedProduct.latestPriceId=this.getProductLatestRange( this.priceMappingList.
              filter(item=> item.product._id == productId));
              clickedProduct.manuFacturerPriceMapping.zonePrices.forEach(item=>{
                if(item.isAddedNow != undefined){
                  item.isAddedNow = false;
                }
              });
              this.toast.success('Details saved Successfully')
            //alert('Details saved Successfully');
          }
        },
        error=> {
          this.loading =false;
          //alert("Error in Saving Details.Please contact admin");
          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
          this.checkUnauthorized(handledError);
          console.log(error);
        }
      );


      }
      //if()
      //If for selected product isNewProdoct is true send a create request
      //Else update request
      //In create and Update request both send only the "product.manuFacturerPriceMapping" JSON
      //Also update the validaty start and end time in JSON with Product validity start and end Time

    }
    else{
      if(this.errMsgSeq){
        this.toast.error('Please fill price for atleast one Zone');
      }
      this.errMsgSeq=true;
      
      //alert('Please fill price for atleast one Zone');
    }

  }
  ValidateForm(productid:string):boolean{
    let clickedProduct = this.mappedProductList.filter(item=> item._id == productid)[0];
    let isProdValid=false;
    let isMRPValid=true;
    clickedProduct.manuFacturerPriceMapping.zonePrices.forEach(zoneItem=> { 
      if(zoneItem.exFactoryPrice != null && zoneItem.exFactoryPrice > 0 
        && zoneItem.gst !=null){
        isProdValid = true;
        //return isProdValid;

      }
      if(zoneItem.minimumRetailPrice ==null){
        isProdValid = false;
        this.errMsgSeq=false;
        isMRPValid = false;
        this.toast.error("Please Provide Value for MRP");
        return isProdValid;
       

      }
      
    });
    //return this.errMsgSeq;
    if(!isMRPValid){
      isProdValid = false
    }
   return isProdValid;

  }
  ValidationBasic(value:number, productid:string,zoneId,type:string) { 
    //alert(value);
    //debugger;
    
    if(type =="fixed"){
      //let value = zonePrice.transportationChargeFixed;
      let flag = value.toString().split('.')[1];
    if(flag != undefined && flag.length == 2){
       this.restrictedValue = value;
      //alert('restrict now');
    }
   else if(flag != undefined && flag.length > 2){
    let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
    manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
     zonePrice.basicPrice = this.restrictedValue;
   }

    }
    
    
    }
    ValidationMRP(value:number, productid:string,zoneId,type:string) { 
      //alert(value);
      //debugger;
      
      if(type =="fixed"){
        //let value = zonePrice.transportationChargeFixed;
        let flag = value.toString().split('.')[1];
      if(flag != undefined && flag.length == 2){
         this.restrictedValue = value;
        //alert('restrict now');
      }
     else if(flag != undefined && flag.length > 2){
      let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
      manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
       zonePrice.minimumRetailPrice = this.restrictedValue;
     }
  
      }
      
      
      }


  ValidationTransport(value:number, productid:string,zoneId,type:string) { 
    //alert(value);
    //debugger;
    
    if(type =="fixed"){
      //let value = zonePrice.transportationChargeFixed;
      let flag = value.toString().split('.')[1];
    if(flag != undefined && flag.length == 2){
       this.restrictedValue = value;
      //alert('restrict now');
    }
   else if(flag != undefined && flag.length > 2){
    let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
    manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
     zonePrice.transportationChargeFixed = this.restrictedValue;
   }

    }
    else if(type =="percentage"){
      //let value = zonePrice.transportationChargeInPercentage;
      let flag = value.toString().split('.')[1];
    if(flag != undefined && flag.length == 2){
       this.restrictedValue = value;
      //alert('restrict now');
    }
   else if(flag != undefined && flag.length > 2){
    let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
    manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
     zonePrice.transportationChargeInPercentage = this.restrictedValue;
   }

    }
    
    }
    ValidationWareHouse(value:number, productid:string,zoneId,type:string) { 
      //alert(value);
      //debugger;
      
      if(type =="fixed"){
        //let value = zonePrice.transportationChargeFixed;
        let flag = value.toString().split('.')[1];
      if(flag != undefined && flag.length == 2){
         this.restrictedValue = value;
        //alert('restrict now');
      }
     else if(flag != undefined && flag.length > 2){
      let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
      manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
       zonePrice.wareHouseChargeFixed = this.restrictedValue;
     }
  
      }
      else if(type =="percentage"){
        //let value = zonePrice.transportationChargeInPercentage;
        let flag = value.toString().split('.')[1];
      if(flag != undefined && flag.length == 2){
         this.restrictedValue = value;
        //alert('restrict now');
      }
     else if(flag != undefined && flag.length > 2){
      let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
      manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
       zonePrice.wareHouseChargeInPercentage = this.restrictedValue;
     }
  
      }
      
      }
      ValidationInsurance(value:number, productid:string,zoneId,type:string) { 
        //alert(value);
        //debugger;
        
        if(type =="fixed"){
          //let value = zonePrice.transportationChargeFixed;
          let flag = value.toString().split('.')[1];
        if(flag != undefined && flag.length == 2){
           this.restrictedValue = value;
          //alert('restrict now');
        }
       else if(flag  != undefined && flag.length > 2){
        let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
        manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
         zonePrice.insuranceChargeFixed = this.restrictedValue;
       }
    
        }
        else if(type =="percentage"){
          //let value = zonePrice.transportationChargeInPercentage;
          let flag = value.toString().split('.')[1];
        if(flag != undefined && flag.length == 2){
           this.restrictedValue = value;
          //alert('restrict now');
        }
       else if(flag != undefined && flag.length > 2){
        let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
        manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
         zonePrice.insuranceChargeInPercentage = this.restrictedValue;
       }
    
        }
        
        }
        ValidationThreePL(value:number, productid:string,zoneId,type:string) { 
          //alert(value);
          //debugger;
          
          if(type =="fixed"){
           
            let flag = value.toString().split('.')[1];
          if(flag != undefined && flag.length == 2){
             this.restrictedValue = value;
           // alert('restrict now');
          }
         else if(flag != undefined && flag.length > 2){
          let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
          manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
           zonePrice.threePlChargeFixed = this.restrictedValue;
         }
      
          }
          else if(type =="percentage"){
            //let value = zonePrice.transportationChargeInPercentage;
            let flag = value.toString().split('.')[1];
          if(flag != undefined && flag.length == 2){
             this.restrictedValue = value;
            //alert('restrict now');
          }
         else if(flag != undefined && flag.length > 2){
          let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
          manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
           zonePrice.threePlChargeInPercentage = this.restrictedValue;
         }
      
          }
          
          }
          getManufacturerBasedItems(){
            this.productSrvice.getProductCategoryByManufacturer(this.filterObject.manuId).subscribe(item=>{
              this.initiateSubcategories(item.data.subCategories);
              this.initiateBrand(item.data.brands);
              this.initiateProductType(item.data.productTypes);
              this.filter();
            })

          }
          filter(){
            this.mappedProductList=this.backupProductList;
            if(this.filterObject.manuId != "All" && this.filterObject.manuId != ''){
              //this.mappedProductList=this.backupProductList;
              this.mappedProductList = this.mappedProductList.
          filter(item=>item.manufacturer._id == this.filterObject.manuId );
          
          
          if(this.filterObject.subCat != '' && this.manuFirstSelection){
           
            this.mappedProductList = this.mappedProductList.
            filter(item=>item.subCategory._id == this.filterObject.subCat );
            if(this.mappedProductList.length > 0){
              this.manuFirstSelection=false;
            this.displayProductDetails=false;
            this.filterObject.brand = "All";
            this.filterObject.prodType = "All";
            //this.filterObject.subCat = "All";
            this.totalActiveProduct = this.mappedProductList.length;
            }
          
          }
          
            }
            if(this.filterObject.brand != "All"){
              //this.mappedProductList=this.backupProductList;
              this.mappedProductList = this.mappedProductList.
              filter(item=>item.brand._id == this.filterObject.brand );
          
              //Total Active products count code
            this.totalActiveProduct = this.mappedProductList.length;
          
            }
            
            if(this.filterObject.prodType != "All"){
             // this.mappedProductList=this.backupProductList;
              this.mappedProductList = this.mappedProductList.
              filter(item=>item.type._id == this.filterObject.prodType );
          
              //Total Active products count code
            this.totalActiveProduct = this.mappedProductList.length;
          
            }
            if(this.filterObject.subCat != "All"){
              //this.mappedProductList=this.backupProductList;
              this.mappedProductList = this.mappedProductList.
            filter(item=>item.subCategory._id == this.filterObject.subCat );
          
            //Total Active products count code
            this.totalActiveProduct = this.mappedProductList.length;
          
            }
            
            if(this.filterObject.brand == "All" && this.filterObject.manuId=="All" && this.filterObject.prodType=="All" && this.filterObject.subCat == "All" ){
              this.mappedProductList=this.backupProductList;
              //Total Active products count code
            this.totalActiveProduct = this.mappedProductList.length;
            }
            
            
          }

addNewProductPricing(prodId:string,manufacturerId:string,subcategoryId:string){
  debugger;
  try {
    let prodSelected = this.mappedProductList.filter(item=> item._id == prodId)[0];
    prodSelected.IsNewPricing=true;
    let newProductPricing = new ManufacturerPriceMapping();
    let bindProduct = new Product();
    bindProduct._id = prodSelected._id;
    newProductPricing.product = bindProduct;
    newProductPricing.zonePrices = new Array<ZonePrice>();
    if(this.zoneList !=null){
      this.zoneList.forEach(item=>{
        let zoneItem = new ZonePrice();
        let priceZone = new pricingZone();
        priceZone._id=item._id;
        priceZone.isActive=item.isActive;
        priceZone.name=item.name;
        zoneItem.pricingZone=priceZone;
        zoneItem.basicPrice=0;
  zoneItem.exFactoryPrice=0;
  zoneItem.gst=null;
  
  zoneItem.insuranceChargeFixed=null;
  zoneItem.insuranceChargeInPercentage=null;
  zoneItem.insuranceTotal=0;
  zoneItem.insuranceGst=null;
  
  zoneItem.transportationChargeFixed=null;
  zoneItem.transportationChargeInPercentage=null;
  zoneItem.transportationGst=null;
  zoneItem.transportationTotal=0;
  
  zoneItem.wareHouseChargeFixed=null;
  zoneItem.wareHouseGst=null;
  zoneItem.wareHouseTotal=0;
  zoneItem.wareHouseChargeInPercentage=null;
  
  zoneItem.threePlChargeFixed=null;
  zoneItem.threePLTotal=0;
  zoneItem.threePlGst=null;
  zoneItem.threePlChargeInPercentage=null;
  zoneItem.loadingChargeFixed = 0;
  zoneItem.loadingChargeInPercentage=0;
  zoneItem.loadingChargeGst=0;
  zoneItem.loadingChargeTotal = 0 ;

  zoneItem.unloadingChargeFixed =0 ;
  zoneItem.unloadingChargeInPercentage=0;
  zoneItem.unloadingChargeGst=0;
  zoneItem.unloadingChargeTotal=0;

  zoneItem.packagingChargeFixed=0;
  zoneItem.packagingChargeInPercentage=0;
  zoneItem.packagingChargeGst=0;
  zoneItem.packagingChargeTotal=0;

  zoneItem.othersChargeFixed=0;
  zoneItem.othersChargeInPercentage=0;
  zoneItem.othersChargeGst=0;
  zoneItem.othersChargeTotal=0;

  
  newProductPricing.zonePrices.push(zoneItem);
  
  
      });
    }
  
    prodSelected.manuFacturerPriceMapping = newProductPricing;
    
  } catch (error) {
    
  }
  }
  addNewPrice(prodId:string){
    debugger;
    try {
      let prodSelected = this.mappedProductList.filter(item=> item._id == prodId)[0];
  prodSelected.IsNewPricing=true;
  let latestProductPricing = this.priceMappingList.
  filter(data=> data._id == prodSelected.latestPriceId)[0];
  
  // Logic to get the from validity date for add new pricing
  prodSelected.validityStart = this.getDateNewPricing(latestProductPricing.validityEndTime);
  //prodSelected.validityStart = this.getDateFormat(latestProductPricing.validityEndTime);
  prodSelected.validityEnd="";
  //prodSelected.startTime=this.getTimeFormat(latestProductPricing.validityStartTime);
  prodSelected.startTime = "00:00";
  prodSelected.endTime="00:00"
  prodSelected.disableToPrice=true;
  prodSelected.IsSaveDisable=false;
  prodSelected.prodGST=null;
  //Creating new product pricing object which will be assigned to product 
  let newProductPricing = new ManufacturerPriceMapping();
  newProductPricing.product = new Product();
  newProductPricing.product._id = latestProductPricing.product._id;
  
  if(latestProductPricing.zonePrices != null){
    newProductPricing.zonePrices = latestProductPricing.zonePrices;
  }
  else {
    newProductPricing.zonePrices = new Array<ZonePrice>();
  }
  
  //prodSelected.manuFacturerPriceMapping = latestProductPricing;
  newProductPricing.zonePrices.forEach(zoneItem=>{
  //let zoneItem = new ZonePrice();
  //zoneItem.pricingZone = zoneItemLatest.pricingZone;
  //zoneItem.minimumOrderQuantity = zoneItemLatest.minimumOrderQuantity;
  //zoneItem.minimumRetailPrice =zoneItemLatest.minimumRetailPrice;
  zoneItem.basicPrice=0;
  zoneItem.exFactoryPrice=0;
  zoneItem.gst=0;
zoneItem.disableZone=true;
//Insurance
zoneItem.insuranceChargeFixed=0;
  zoneItem.insuranceChargeInPercentage=0;
  zoneItem.insuranceTotal=0;
  zoneItem.insuranceGst=0;
  
  //Transportation
  zoneItem.transportationChargeFixed=0;
  zoneItem.transportationChargeInPercentage=0;
  zoneItem.transportationGst=0;
  zoneItem.transportationTotal=0;
  
  //Warehouse 
  zoneItem.wareHouseChargeFixed=0;
  zoneItem.wareHouseGst=0;
  zoneItem.wareHouseTotal=0;
  zoneItem.wareHouseChargeInPercentage=0;
  
  //Three PL charge
  zoneItem.threePlChargeFixed=0;
  zoneItem.threePLTotal=0;
  zoneItem.threePlGst=0;
  zoneItem.threePlChargeInPercentage=0;

  //Loading Charge 
  zoneItem.loadingChargeFixed = 0;
  zoneItem.loadingChargeInPercentage=0;
  zoneItem.loadingChargeGst=0;
  zoneItem.loadingChargeTotal = 0 ;

//unloading Charge
  zoneItem.unloadingChargeFixed =0 ;
  zoneItem.unloadingChargeInPercentage=0;
  zoneItem.unloadingChargeGst=0;
  zoneItem.unloadingChargeTotal=0;

  //Pacakging Charge
  zoneItem.packagingChargeFixed=0;
  zoneItem.packagingChargeInPercentage=0;
  zoneItem.packagingChargeGst=0;
  zoneItem.packagingChargeTotal=0;
  
//Other Charges
  zoneItem.othersChargeFixed=0;
  zoneItem.othersChargeInPercentage=0;
  zoneItem.othersChargeGst=0;
  zoneItem.othersChargeTotal=0;
zoneItem.landingPrice=0;
  
  //newProductPricing.zonePrices.push(zoneItem);
  
  });
  
  prodSelected.manuFacturerPriceMapping = newProductPricing;
      
    } catch (error) {
      
    }
   // let prodSelected = new Product();
  
  }
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
mapProductsToPriceMappingList(){
  //debugger;
  this.filteredProuctMappingList=Array<Product>();
  this.filteredProuctMappingList=this.productList.filter(item=> item.status == 'Active');
  for(let i=0;i < this.filteredProuctMappingList.length;i++){
    //debugger;
    let value=this.filteredProuctMappingList[i];
    let productData = new Product();
    
    productData._id=value._id;
    productData.IsNewPricing=false;
    productData.disableToPrice=false;
    //alert(productData._id);
    productData.name=value.name;
    productData.areasOfApplication=value.areasOfApplication;
    productData.brand=value.brand;
    productData.type=value.type;
    productData.description=value.description;
    productData.code=value.code;
    //productData.dimension=value.dimension;
    productData.hsnCode=value.hsnCode;
    productData.dimension=value.dimension;
    productData.category=value.category;
    productData.subCategory=value.subCategory;
    productData.uom=value.uom;
    productData.manufacturer=value.manufacturer;
    productData.gradeOrSpec=value.gradeOrSpec;
    productData.subCategoryName=value.subCategory.name;
    productData.brandName=value.brand.name
    productData.typeName=value.type.name;
    productData.categoryName = value.category.name;
    
    console.log(this.priceMappingList);
    productData.latestPriceId=this.getProductLatestRange( this.priceMappingList.
      filter(item=> item.product._id == value._id));
    debugger;
    productData.manuFacturerPriceMapping=this.getProductCurrentPrice( this.priceMappingList.
    filter(item=> item.product._id == value._id));
    
    if(productData.manuFacturerPriceMapping!=null){
      productData.IsSaveDisable=false;
      productData.validityStart=this.getDateFormat( productData.manuFacturerPriceMapping.validityStartTime);
      productData.validityEnd=this.getDateFormat( productData.manuFacturerPriceMapping.validityEndTime);
      productData.startTime = this.getTimeFormat(productData.manuFacturerPriceMapping.validityStartTime);
      productData.endTime = this.getTimeFormat(productData.manuFacturerPriceMapping.validityEndTime);
      //debugger;
      try {
        //debugger;
        productData.manuFacturerPriceMapping.zonePrices = productData.manuFacturerPriceMapping.zonePrices.
        filter(zoneItem => zoneItem.pricingZone != null);
        productData.manuFacturerPriceMapping.zonePrices = productData.manuFacturerPriceMapping.zonePrices.
        filter(zoneItem => zoneItem.pricingZone.isActive == true);
      } catch (error) {
        
      }
     
      productData.manuFacturerPriceMapping.zonePrices.forEach(zonePrice => {
        zonePrice.pricingZoneName=zonePrice.pricingZone.name;
        zonePrice.insuranceTotal=0;
        zonePrice.transportationTotal=0;
        zonePrice.threePLTotal=0;
        zonePrice.wareHouseTotal=0;
        zonePrice.disableZone=false;
        //Test Details
       
      zonePrice.minimumOrderQuantity = zonePrice.minimumOrderQuantity;
       debugger;
        let result = this.IntializeTotalPrices(zonePrice.insuranceChargeFixed, zonePrice.insuranceChargeInPercentage, zonePrice.insuranceGst, zonePrice.exFactoryPrice);
        zonePrice.insuranceTotal = result.totalAmount;
        zonePrice.CurrentSelectedI=result.type;
      
         
        result = this.IntializeTotalPrices(zonePrice.transportationChargeFixed, zonePrice.transportationChargeInPercentage, zonePrice.transportationGst, zonePrice.exFactoryPrice);
        zonePrice.transportationTotal = result.totalAmount;;
        zonePrice.CurrentSelectedT = result.type;
        
        result = this.IntializeTotalPrices(zonePrice.threePlChargeFixed, zonePrice.threePlChargeInPercentage, zonePrice.threePlGst, zonePrice.exFactoryPrice);
        zonePrice.threePLTotal = result.totalAmount;
        zonePrice.CurrentSelectedP=result.type;
      
        
        result = this.IntializeTotalPrices(zonePrice.wareHouseChargeFixed, zonePrice.wareHouseChargeInPercentage, zonePrice.wareHouseGst, zonePrice.exFactoryPrice);
        zonePrice.wareHouseTotal = result.totalAmount;
        zonePrice.CurrentSelectedW = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.loadingChargeFixed, zonePrice.loadingChargeInPercentage, zonePrice.loadingChargeGst, zonePrice.exFactoryPrice);
        zonePrice.loadingChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedL = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.unloadingChargeFixed, zonePrice.unloadingChargeInPercentage, zonePrice.unloadingChargeGst, zonePrice.exFactoryPrice);
        zonePrice.unloadingChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedU = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.packagingChargeFixed, zonePrice.packagingChargeInPercentage, zonePrice.packagingChargeGst, zonePrice.exFactoryPrice);
        zonePrice.packagingChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedPC = result.type;
      
        result = this.IntializeTotalPrices(zonePrice.othersChargeFixed, zonePrice.othersChargeInPercentage, zonePrice.othersChargeGst, zonePrice.exFactoryPrice);
        zonePrice.othersChargeTotal = result.totalAmount;
        zonePrice.CurrentSelectedO = result.type;

        //element.pricingZoneName = this.mapZoneIdToName(element.pricingZoneId);
        
        
      });
      this.mappedProductList.push(productData);

    }
    else{
      this.mappedProductList.push(productData);
      this.addNewManufacturerInProduct(productData._id);
      //this.addNewProductPricing(productData._id,productData.manufacturer._id,productData.subCategory._id);
      //this.addNewPrice(productData._id);
      productData.IsSaveDisable = true;
      productData.validityStart="";
      productData.manuFacturerPriceMapping.zonePrices.forEach(item=>{
        item.minimumRetailPrice=null;
      })
console.log(this.mappedProductList)

    }
    
      
    



  }
  console.log(this.mappedProductList);
  this.backupProductList=this.mappedProductList;


}

//#region  Price calculation

IntializeTotalPrices(fixedPrice, percentage, gst,exfactory):any {
  let totalAmount = 0;
  let result = {
    totalAmount:0,
    type:''
  };
  if (fixedPrice != null && fixedPrice > 0) {
      let gstcalculate = this.caluculateGST(fixedPrice, gst);
      totalAmount = fixedPrice + gstcalculate;
      result.type = 'Fixed'

      
  }
  else if (percentage !=null && percentage > 0) {
      let amount = this.caluculatePercentageValue(exfactory, percentage);
      let gstcalculate = this.caluculateGST(amount, gst);
      totalAmount = amount + gstcalculate;
      result.type = "Percent";
  }
  result.totalAmount = totalAmount;
  return result;
}

 CalculateLandingPrice(type, Identifier,productid,zoneId) {
  let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
  manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
  this.validateBasicPrice(productid,zoneId);
  //if (this.validateBasicPrice(productid,zoneId)) {
      if (type == "Fixed" && Identifier == "Ex") {
          let gst = this.caluculateGST(zonePrice.basicPrice, zonePrice.gst);
          zonePrice.exFactoryPrice = zonePrice.basicPrice + gst;
          this.RecalculateAll(productid,zoneId);
          
      }
      else if (type == "Percent" && Identifier == "T") {

          let transportationAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.transportationChargeInPercentage);
          let gstonTrasportaion = this.caluculateGST(transportationAmount, zonePrice.transportationGst);
          zonePrice.transportationTotal = transportationAmount + gstonTrasportaion;
          zonePrice.transportationChargeFixed = 0;
          zonePrice.CurrentSelectedT = type;
      }
      else if (type == "Fixed" && Identifier == "T") {
          let gstonTrasportaion = this.caluculateGST(zonePrice.transportationChargeFixed, zonePrice.transportationGst);
          zonePrice.transportationTotal = zonePrice.transportationChargeFixed + gstonTrasportaion;
          zonePrice.transportationChargeInPercentage = 0;
          zonePrice.CurrentSelectedT = type;
      }

      else if (type == "Percent" && Identifier == "W") {
          let WHAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.wareHouseChargeInPercentage);
          let gstonWHAmount = this.caluculateGST(WHAmount, zonePrice.wareHouseGst);
          zonePrice.wareHouseTotal = WHAmount + gstonWHAmount;
          zonePrice.wareHouseChargeFixed = 0;
          zonePrice.CurrentSelectedW = type;

      }
      else if (type == "Fixed" && Identifier == "W") {
          let gstonWHAmount = this.caluculateGST(zonePrice.wareHouseChargeFixed, zonePrice.wareHouseGst);
          zonePrice.wareHouseTotal = zonePrice.wareHouseChargeFixed + gstonWHAmount;
          zonePrice.wareHouseChargeInPercentage = 0;
          zonePrice.CurrentSelectedW = type;
      }
      else if (type == "Percent" && Identifier == "3PL") {
          let PLAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.threePlChargeInPercentage);
          let gstonPL = this.caluculateGST(PLAmount, zonePrice.threePlGst);
          zonePrice.threePLTotal = PLAmount + gstonPL;
          zonePrice.threePlChargeFixed = 0;
          zonePrice.CurrentSelectedP = type;
      }
      else if (type == "Fixed" && Identifier == "3PL") {
          let gstonPL = this.caluculateGST(zonePrice.threePlChargeFixed, zonePrice.threePlGst);
          zonePrice.threePLTotal = zonePrice.threePlChargeFixed + gstonPL;
          zonePrice.threePlChargeInPercentage = 0
          zonePrice.CurrentSelectedP = type;
      }
      else if (type == "Percent" && Identifier == "I") {
          let InsuranceAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.insuranceChargeInPercentage);
          let gstonInsurance = this.caluculateGST(InsuranceAmount, zonePrice.insuranceGst);
          zonePrice.insuranceTotal = InsuranceAmount + gstonInsurance;
          zonePrice.insuranceChargeFixed = 0;
          zonePrice.CurrentSelectedI = type;
      }
      else if (type == "Fixed" && Identifier == "I") {
          let gstonInsurance = this.caluculateGST(zonePrice.insuranceChargeFixed, zonePrice.insuranceGst);
          zonePrice.insuranceTotal = zonePrice.insuranceChargeFixed + gstonInsurance;
          zonePrice.insuranceChargeInPercentage = 0;
          zonePrice.CurrentSelectedI = type;
      }
      else if (type == "Percent" && Identifier == "L") {
        let InsuranceAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.loadingChargeInPercentage);
        let gstonInsurance = this.caluculateGST(InsuranceAmount, zonePrice.loadingChargeGst);
        zonePrice.loadingChargeTotal = InsuranceAmount + gstonInsurance;
        zonePrice.loadingChargeFixed = 0;
        zonePrice.CurrentSelectedL = type;
    }
    else if (type == "Fixed" && Identifier == "L") {
        let gstonInsurance = this.caluculateGST(zonePrice.loadingChargeFixed, zonePrice.loadingChargeGst);
        zonePrice.loadingChargeTotal = zonePrice.loadingChargeFixed + gstonInsurance;
        zonePrice.loadingChargeInPercentage = 0;
        zonePrice.CurrentSelectedL = type;
    }
    else if (type == "Percent" && Identifier == "U") {
      let InsuranceAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.unloadingChargeInPercentage);
      let gstonInsurance = this.caluculateGST(InsuranceAmount, zonePrice.unloadingChargeGst);
      zonePrice.unloadingChargeTotal = InsuranceAmount + gstonInsurance;
      zonePrice.unloadingChargeFixed = 0;
      zonePrice.CurrentSelectedU = type;
  }
  else if (type == "Fixed" && Identifier == "U") {
      let gstonInsurance = this.caluculateGST(zonePrice.unloadingChargeFixed, zonePrice.unloadingChargeGst);
      zonePrice.unloadingChargeTotal = zonePrice.unloadingChargeFixed + gstonInsurance;
      zonePrice.unloadingChargeInPercentage = 0;
      zonePrice.CurrentSelectedU = type;
  }
  else if (type == "Percent" && Identifier == "PC") {
    let InsuranceAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.packagingChargeInPercentage);
    let gstonInsurance = this.caluculateGST(InsuranceAmount, zonePrice.packagingChargeGst);
    zonePrice.packagingChargeTotal = InsuranceAmount + gstonInsurance;
    zonePrice.packagingChargeFixed = 0;
    zonePrice.CurrentSelectedPC = type;
}
else if (type == "Fixed" && Identifier == "PC") {
    let gstonInsurance = this.caluculateGST(zonePrice.packagingChargeFixed, zonePrice.packagingChargeGst);
    zonePrice.packagingChargeTotal = zonePrice.packagingChargeFixed + gstonInsurance;
    zonePrice.packagingChargeInPercentage = 0;
    zonePrice.CurrentSelectedPC = type;
}
else if (type == "Percent" && Identifier == "O") {
  let InsuranceAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice, zonePrice.othersChargeInPercentage);
  let gstonInsurance = this.caluculateGST(InsuranceAmount, zonePrice.othersChargeGst);
  zonePrice.othersChargeTotal = InsuranceAmount + gstonInsurance;
  zonePrice.othersChargeFixed = 0;
  zonePrice.CurrentSelectedO = type;
}
else if (type == "Fixed" && Identifier == "O") {
  let gstonInsurance = this.caluculateGST(zonePrice.othersChargeFixed, zonePrice.othersChargeGst);
  zonePrice.othersChargeTotal = zonePrice.othersChargeFixed + gstonInsurance;
  zonePrice.othersChargeInPercentage = 0;
  zonePrice.CurrentSelectedO = type;
}
  //}
  console.log('Transport : ' + zonePrice.transportationTotal);
  console.log('WareHouse : ' + zonePrice.wareHouseTotal);
  console.log('Insurance : ' + zonePrice.insuranceTotal);
  console.log('Three 3PL : ' + zonePrice.threePLTotal);
  console.log('Loading : ' + zonePrice.loadingChargeTotal);
  console.log('UnloadingL : ' + zonePrice.unloadingChargeTotal);
  console.log('Pacakaging : ' + zonePrice.packagingChargeTotal);
  console.log('Others : ' + zonePrice.othersChargeTotal);
  console.log('Extra Total: ' + (zonePrice.transportationTotal + zonePrice.insuranceTotal + zonePrice.wareHouseTotal + zonePrice.threePLTotal + zonePrice.loadingChargeTotal + zonePrice.unloadingChargeTotal + zonePrice.packagingChargeTotal + zonePrice.othersChargeTotal));
  console.log('Ex Factory price:' + zonePrice.exFactoryPrice);
  
  zonePrice.landingPrice = this.checkNan(zonePrice.exFactoryPrice)  + this.checkNan(zonePrice.transportationTotal) + 
  this.checkNan(zonePrice.insuranceTotal) + this.checkNan(zonePrice.wareHouseTotal) + this.checkNan(zonePrice.threePLTotal) + 
  this.checkNan(zonePrice.loadingChargeTotal) + this.checkNan(zonePrice.unloadingChargeTotal) + this.checkNan(zonePrice.packagingChargeTotal)
   + this.checkNan(zonePrice.othersChargeTotal);
  console.log('Landing Price: ' + zonePrice.landingPrice);

if(isNaN(zonePrice.exFactoryPrice)){
  zonePrice.exFactoryPrice = 0;
}
if(isNaN(zonePrice.transportationTotal)){
zonePrice.transportationTotal=0;
}
if(isNaN(zonePrice.insuranceTotal)){
  zonePrice.insuranceTotal = 0;
}
if(isNaN(zonePrice.wareHouseTotal)){
  zonePrice.wareHouseTotal=0;
}
if(isNaN(zonePrice.threePLTotal)){
  zonePrice.threePLTotal = 0;
}
if(isNaN(zonePrice.loadingChargeTotal)){
zonePrice.loadingChargeTotal =0;
}
if(isNaN(zonePrice.unloadingChargeTotal)){
  zonePrice.unloadingChargeTotal = 0;
}
if(isNaN(zonePrice.packagingChargeTotal)){
  zonePrice.packagingChargeTotal = 0;
}
if(isNaN(zonePrice.othersChargeTotal)){
  zonePrice.othersChargeTotal = 0;
}

if(zonePrice.landingPrice == 0 && zonePrice.basicPrice > 0 ){
  this.RecalculateAll(productid,zoneId);
}

 

}
checkNan(value):number{
  if(isNaN(value)){
    return 0;
  }
  else if(value == undefined){
  return 0;
  }
  return value;
  }

 validateBasicPrice(productid,zoneId) {
  let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
  manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
  if (zonePrice.basicPrice <= 0) {
      zonePrice.basicPrice = 0;
      zonePrice.exFactoryPrice=0;
      zonePrice.insuranceTotal = 0;
      zonePrice.transportationTotal = 0;
      zonePrice.wareHouseTotal = 0;
      zonePrice.threePLTotal = 0;
      zonePrice.loadingChargeTotal =0;
      zonePrice.unloadingChargeTotal=0;
      zonePrice.othersChargeTotal=0;
      zonePrice.packagingChargeTotal=0
      zonePrice.landingPrice = 0;
      zonePrice.disableZone=true;
     
      return false;
  }
  else {
    zonePrice.disableZone=false;
      return true;
  }
}
RecalculateAll(prodId,zoneId){
  let zoneItem=this.mappedProductList.filter(item=> item._id == prodId)[0].
  manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
  //this.CalculateLandingPrice('Fixed','Ex',prodId,zoneItem.pricingZone._id);
  let result = this.IntializeTotalPrices(zoneItem.insuranceChargeFixed, zoneItem.insuranceChargeInPercentage, zoneItem.insuranceGst, zoneItem.exFactoryPrice);
       // zonePrice.insuranceTotal = result.totalAmount;
       zoneItem.CurrentSelectedI=result.type;

         
        result = this.IntializeTotalPrices(zoneItem.transportationChargeFixed, zoneItem.transportationChargeInPercentage, zoneItem.transportationGst, zoneItem.exFactoryPrice);
       // zonePrice.transportationTotal = result.totalAmount;;
        zoneItem.CurrentSelectedT = result.type;
        
        result = this.IntializeTotalPrices(zoneItem.threePlChargeFixed, zoneItem.threePlChargeInPercentage, zoneItem.threePlGst, zoneItem.exFactoryPrice);
        //zonePrice.threePLTotal = result.totalAmount;
        zoneItem.CurrentSelectedP=result.type;

        
        result = this.IntializeTotalPrices(zoneItem.wareHouseChargeFixed, zoneItem.wareHouseChargeInPercentage, zoneItem.wareHouseGst, zoneItem.exFactoryPrice);
       // zonePrice.wareHouseTotal = result.totalAmount;
        zoneItem.CurrentSelectedW = result.type;

        result = this.IntializeTotalPrices(zoneItem.loadingChargeFixed, zoneItem.loadingChargeInPercentage, zoneItem.loadingChargeGst, zoneItem.exFactoryPrice);
 
  zoneItem.CurrentSelectedL = result.type;

  result = this.IntializeTotalPrices(zoneItem.unloadingChargeFixed, zoneItem.unloadingChargeInPercentage, zoneItem.unloadingChargeGst, zoneItem.exFactoryPrice);
 
  zoneItem.CurrentSelectedU = result.type;

  result = this.IntializeTotalPrices(zoneItem.packagingChargeFixed, zoneItem.packagingChargeInPercentage, zoneItem.packagingChargeGst, zoneItem.exFactoryPrice);
  
  zoneItem.CurrentSelectedPC = result.type;

  result = this.IntializeTotalPrices(zoneItem.othersChargeFixed, zoneItem.othersChargeInPercentage, zoneItem.othersChargeGst, zoneItem.exFactoryPrice);
 
  zoneItem.CurrentSelectedO = result.type;

  this.CalculateLandingPrice(zoneItem.CurrentSelectedI,'I',prodId,zoneItem.pricingZone._id);
  this.CalculateLandingPrice(zoneItem.CurrentSelectedW,'W',prodId,zoneItem.pricingZone._id);
  this.CalculateLandingPrice(zoneItem.CurrentSelectedT,'T',prodId,zoneItem.pricingZone._id);
  this.CalculateLandingPrice(zoneItem.CurrentSelectedP,'3PL',prodId,zoneItem.pricingZone._id);
  this.CalculateLandingPrice(zoneItem.CurrentSelectedPC,'PC',prodId,zoneItem.pricingZone._id)
  this.CalculateLandingPrice(zoneItem.CurrentSelectedL,'L',prodId,zoneItem.pricingZone._id)
  this.CalculateLandingPrice(zoneItem.CurrentSelectedU,'U',prodId,zoneItem.pricingZone._id)
  this.CalculateLandingPrice(zoneItem.CurrentSelectedO,'O',prodId,zoneItem.pricingZone._id)
}

 //#endregion
getDateFormat(date:any):string{
  let d1=date.split('T')[0];
  return d1;
}
getTimeFormat(date:any):string{
  let start = date.split('-');
  let time = start[2].split('T')[1];
  start[2] = start[2].split('T')[0];
  let hour = 0;
  let minute = 0;
  let secs = 0;
  let timeString = "00:00";

  if (time != null) {
      let timeArray = time.split(":");
      if (timeArray[0] != null && timeArray[0] != undefined) {
          hour = timeArray[0];
      }
      if (timeArray[1] != null && timeArray[1] != undefined) {
          minute = timeArray[1];
      }
       
      if (timeArray[2] != null && timeArray[2] != undefined) {
          secs = timeArray[2].split('.')[0];
      }
      timeString = hour + ":" + minute;
       
  }
  return timeString;
  
}
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
getProductCurrentPrice(priceList:ManufacturerPriceMapping[]):ManufacturerPriceMapping{
for(let i=0;i < priceList.length;i++){
  if(this.checkDateRange(priceList[i].validityStartTime,priceList[i].validityEndTime)){
    return priceList[i];
  }

}
return null;
}

getProductFuturePrice(priceList:ManufacturerPriceMapping[]):Array<ManufacturerPriceMapping>{
  let result=new Array< ManufacturerPriceMapping>();
for(let i=0;i < priceList.length;i++){
  if(this.checkDateRangeFuture(priceList[i].validityStartTime,priceList[i].validityEndTime)){
    result.push(priceList[i]);
  }

}
return result;
}
getProductLatestRange(priceList:ManufacturerPriceMapping[]):string{
  //debugger;
  let result=new Array< ManufacturerPriceMapping>();
  let latestPricingId;
  let j=0;
  for(let i=0;i < priceList.length;i++){
  let data = this.checkLatestDate(priceList[i].validityEndTime,priceList[j].validityEndTime);
  if(data){
   j=i;

  }
  
      
  
  }
  if(priceList.length > j ){
    latestPricingId= priceList[j]._id;
  }
  
  return latestPricingId;
}
checkLatestDate(dateFrom,dateTo){
  let d1 = dateFrom.split("-");
  let d2 = dateTo.split("-");
  
    d1[2]=d1[2].split("T")[0];
    d2[2]=d2[2].split("T")[0];
  
  //var c = dateCheck.split("-");
  
  let from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
  let to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
  if(from > to){
    return true;
    }
    else{
    return false;
    }

}
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
 checkDateRange(dateFrom,dateTo):boolean{
try 
{
  //debugger;
  let dateCheck = new Date();
  
  let d1 = dateFrom.split("-");
  let d2 = dateTo.split("-");
  
    d1[2]=d1[2].split("T")[0];
    d2[2]=d2[2].split("T")[0];
  
  //var c = dateCheck.split("-");
  
  let from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
  let to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
  let check =dateCheck ;
  
  
  if(check >= from && check <= to){
  return true;
  }
  else{
  return false;
  }
}
catch{
console.log("Error");
}
  
  }
  checkDateRangeFuture(dateFrom,dateTo):boolean{
    try 
    {
      
      let dateCheck = new Date();
      
      let d1 = dateFrom.split("-");
      let d2 = dateTo.split("-");
      
        d1[2]=d1[2].split("T")[0];
        d2[2]=d2[2].split("T")[0];
      
      //var c = dateCheck.split("-");
      
      let from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
      let to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
      let check =dateCheck ;
      
      
      if(check >= from ){
      return true;
      }
      else{
      return false;
      }
    }
    catch{
    console.log("Error");
    }
      
      }
    
   calculateBuyerLandingPrice(productid:string,zoneId:string):any{
     //this.recalculatePrices(productid,zoneId);
     let item = this.mappedProductList.filter(item=> item._id == productid)[0].
     manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
  
     
     return (item.exFactoryPrice + item.transportationTotal + item.wareHouseTotal
      + item.threePLTotal +item.insuranceTotal); 

   }
  /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
   calculateExFactoryPrice(productid:string,zoneId:string){
     //debugger;
     let selectedProduct = this.mappedProductList.filter(item=> item._id == productid)[0];
     selectedProduct.IsSaveDisable=false;
     let zonePrice=selectedProduct.
     manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
    //let zonePrice=this.mappedProductList[0].manuFacturerPriceMapping.zonePrices[0];
    if(zonePrice.basicPrice == null || zonePrice.basicPrice==0){
      zonePrice.exFactoryPrice=0;
}
else {
let gst = this.caluculateGST(zonePrice.basicPrice,zonePrice.gst);
zonePrice.exFactoryPrice = zonePrice.basicPrice + gst;
this.recalculateExFactoryPrices(productid,zoneId);

}
//zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
    }

    recalculateExFactoryPrices(productid:string,zoneId:string,type?:string){
      ///&& (type =='fixed' || type == 'gst')
      debugger;
      let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
      manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
      if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) &&
        zonePrice.transportationChargeFixed !=null && zonePrice.transportationChargeFixed !=0  ){
        this.calculateTransportationFixedAmount(productid,zoneId,type);
      }
      else if(zonePrice.transportationChargeInPercentage !=null && zonePrice.transportationChargeInPercentage !=0){
        this.calculateTransportation(productid,zoneId);
    
      }
     
      if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
      && zonePrice.wareHouseChargeFixed !=null && zonePrice.wareHouseChargeFixed !=0 )
      {
        this.calculateWareHouseFixedAmount(productid,zoneId,type);
      
      }
      else if(zonePrice.wareHouseChargeInPercentage !=null && zonePrice.wareHouseChargeInPercentage != 0){
        this.calculateWareHouse(productid,zoneId);
    
      }
     
      if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
                      && zonePrice.threePlChargeFixed !=null &&  zonePrice.threePlChargeFixed !=0 ) 
                      {
                        this.calculate3PLCostFixedAmount(productid,zoneId,type);
                      
                      }
                      else if(zonePrice.threePlChargeInPercentage !=null || zonePrice.threePlChargeInPercentage !=0){
                        this.calculate3PLCost(productid,zoneId);
      
                      }
                      
                      if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
                      && zonePrice.insuranceChargeFixed !=null && zonePrice.insuranceChargeFixed !=0)
                      {
                      this.calculateInsuranceCostFixedAmount(productid,zoneId,type);
                      }
                      else if(zonePrice.insuranceChargeInPercentage !=null){
                        this.calculateInsuranceCost(productid,zoneId);
      
                      }
                     
      zonePrice.landingPrice = zonePrice.exFactoryPrice + zonePrice.transportationTotal + zonePrice.threePLTotal + zonePrice.insuranceTotal + zonePrice.wareHouseTotal;
    
    }

recalculatePrices(productid:string,zoneId:string,type?:string){
  ///&& (type =='fixed' || type == 'gst')
  
  let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
  manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
  debugger;
  if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) &&
    zonePrice.transportationChargeFixed !=null && zonePrice.transportationChargeFixed > 0  && (type =='fixed' || type == 'gst')){
    this.calculateTransportationFixedAmount(productid,zoneId,type);
  }
  else if(zonePrice.transportationChargeInPercentage !=null && zonePrice.transportationChargeInPercentage > 0){
    this.calculateTransportation(productid,zoneId);

  }
  else{
    zonePrice.transportationTotal=0;
  }
  if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
  && zonePrice.wareHouseChargeFixed !=null && zonePrice.wareHouseChargeFixed > 0 && (type =='fixed' || type == 'gst'))
  {
    this.calculateWareHouseFixedAmount(productid,zoneId,type);
  
  }
  else if(zonePrice.wareHouseChargeInPercentage !=null && zonePrice.wareHouseChargeInPercentage > 0){
    this.calculateWareHouse(productid,zoneId);

  }
  else{
    zonePrice.wareHouseTotal =0 ;
  }
  debugger;
  if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
                  && zonePrice.threePlChargeFixed !=null &&  zonePrice.threePlChargeFixed > 0 && (type =='fixed' || type == 'gst')) 
                  {
                    this.calculate3PLCostFixedAmount(productid,zoneId,type);
                  
                  }
                  else if(zonePrice.threePlChargeInPercentage !=null && zonePrice.threePlChargeInPercentage > 0){
                    this.calculate3PLCost(productid,zoneId);
  
                  }
                  else{
                    zonePrice.threePLTotal=0;
                  }
                  if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
                  && zonePrice.insuranceChargeFixed !=null && zonePrice.insuranceChargeFixed > 0 && (type =='fixed' || type == 'gst'))
                  {
                  this.calculateInsuranceCostFixedAmount(productid,zoneId,type);
                  }
                  else if(zonePrice.insuranceChargeInPercentage !=null && zonePrice.insuranceChargeInPercentage > 0 ){
                    this.calculateInsuranceCost(productid,zoneId);
  
                  }
                  else{
                    zonePrice.insuranceTotal=0;
                  }
  zonePrice.landingPrice = zonePrice.exFactoryPrice + zonePrice.transportationTotal + zonePrice.threePLTotal + zonePrice.insuranceTotal + zonePrice.wareHouseTotal;

}
    /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
     calculateTransportation(productid:string,zoneId:string){
       //debugger;
      let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
      manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
      let transportationAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice , zonePrice.transportationChargeInPercentage);
      let gstonTrasportaion = this.caluculateGST(transportationAmount , zonePrice.transportationGst);
      zonePrice.transportationTotal= transportationAmount + gstonTrasportaion;
      zonePrice.transportationChargeFixed=null;
      //zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
      //zonePrice.landingPrice=zonePrice.landingPrice + transportationAmount + gstonTrasportaion; 
     
      }
      /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
       calculateWareHouse(productid:string,zoneId:string){
        let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
        manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
        let WHAmount =this.caluculatePercentageValue( zonePrice.exFactoryPrice , zonePrice.wareHouseChargeInPercentage);
        let gstonWHAmount = this.caluculateGST(WHAmount , zonePrice.wareHouseGst);
        zonePrice.wareHouseTotal= WHAmount + gstonWHAmount; 
        zonePrice.wareHouseChargeFixed=null;
        //zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);

        //document.getElementById("wareHouseAmount").innerHTML =WHAmount + gstonWHAmount;
        //console.log(WHAmount + " , " + gstonWHAmount);
        }
        /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
         calculate3PLCost(productid:string,zoneId:string){
           //debugger;
          let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
          manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
          let PLAmount = this.caluculatePercentageValue(zonePrice.exFactoryPrice , zonePrice.threePlChargeInPercentage);
          let gstonPL = this.caluculateGST(PLAmount , zonePrice.threePlGst);
          zonePrice.threePLTotal= PLAmount + gstonPL; 
          zonePrice.threePlChargeFixed=null;
          //zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
          //document.getElementById("3PLAmount").innerHTML =PLAmount + gstonPL;
          //console.log(PLAmount + " , " + gstonPL);
          }
          /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
           calculateInsuranceCost(productid:string,zoneId:string){
            let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
            manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
            let InsuranceAmount =this.caluculatePercentageValue( zonePrice.exFactoryPrice , zonePrice.insuranceChargeInPercentage);
            let gstonInsurance= this.caluculateGST(InsuranceAmount , zonePrice.insuranceGst);
            zonePrice.insuranceTotal=InsuranceAmount + gstonInsurance;
            zonePrice.insuranceChargeFixed=null; 
            //zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
           // document.getElementById("insuranceAmount").innerHTML =InsuranceAmount + gstonInsurance;
            //console.log(InsuranceAmount + " , " + gstonInsurance);
            }
            /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
             calculateTransportationFixedAmount(productid:string,zoneId:string,type:string){
               //debugger;
              let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
              manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
              if(type=='fixed'){
                zonePrice.transportationChargeInPercentage = null;

              }
              if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
              && zonePrice.transportationChargeFixed !=null && zonePrice.transportationChargeFixed !=0)
              {
              //let transportationAmount = (zonePrice.exFactoryPrice + zonePrice.transportationChargeFixed);
              let gstonTrasportaion = this.caluculateGST(zonePrice.transportationChargeFixed , zonePrice.transportationGst);
              zonePrice.transportationTotal= zonePrice.transportationChargeFixed + gstonTrasportaion; 
              zonePrice.transportationChargeInPercentage=null;
              
              }
              else if(zonePrice.transportationChargeInPercentage !=null){
                this.calculateTransportation(productid,zoneId);

              }
              else{
                zonePrice.transportationTotal=0;
              }
              //zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
              }
              /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
               calculateWareHouseFixedAmount(productid:string,zoneId:string,type:string){
                let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
                manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
                if(type=='fixed'){
                  zonePrice.wareHouseChargeInPercentage = null;

                }
                if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
                && zonePrice.wareHouseChargeFixed !=null && zonePrice.wareHouseChargeFixed !=0)
                {
                //var WHAmount = zonePrice.exFactoryPrice +  zonePrice.wareHouseChargeFixed;
                let gstonWHAmount = this.caluculateGST(zonePrice.wareHouseChargeFixed , zonePrice.wareHouseGst);
                zonePrice.wareHouseTotal= zonePrice.wareHouseChargeFixed + gstonWHAmount; 
                zonePrice.wareHouseChargeInPercentage=null;
                //document.getElementById("wareHouseAmount").innerHTML =WHAmount + gstonWHAmount;
                //console.log(WHAmount + " , " + gstonWHAmount);
                }
                else if(zonePrice.wareHouseChargeInPercentage !=null){
                  this.calculateWareHouse(productid,zoneId);

                }
                else{
                  zonePrice.wareHouseTotal=0;
                }
                
                //zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
                }
                /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
                 calculate3PLCostFixedAmount(productid:string,zoneId:string,type:string){
                   //debugger;
                   
                  let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
                  manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
                  if(type=='fixed'){
                    zonePrice.threePlChargeInPercentage = null;

                  }
                  if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
                  && zonePrice.threePlChargeFixed !=null &&  zonePrice.threePlChargeFixed !=0) 
                  {
                  //var PLAmount =zonePrice.exFactoryPrice + zonePrice.threePlChargeFixed;
                  let gstonPL = this.caluculateGST( zonePrice.threePlChargeFixed , zonePrice.threePlGst);
                  zonePrice.threePLTotal=zonePrice.threePlChargeFixed + gstonPL;
                  
                  
                  //zonePrice.landingPrice=zonePrice.landingPrice +  zonePrice.threePlChargeFixed + gstonPL; 
                  //document.getElementById("3PLAmount").innerHTML =PLAmount + gstonPL;
                  //console.log(PLAmount + " , " + gstonPL);
                  }
                  else if(zonePrice.threePlChargeInPercentage !=null || zonePrice.threePlChargeInPercentage !=0){
                    this.calculate3PLCost(productid,zoneId);
  
                  }
                  else{
                    zonePrice.threePLTotal=0;
                  }
                  //zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
                  }
                  /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
                   calculateInsuranceCostFixedAmount(productid:string,zoneId:string,type:string){
                     debugger;
                    let zonePrice=this.mappedProductList.filter(item=> item._id == productid)[0].
                    manuFacturerPriceMapping.zonePrices.filter(price=> price.pricingZone._id == zoneId)[0];
                    if(type=='fixed'){
                      zonePrice.insuranceChargeInPercentage = null;
  
                    }
                    if((zonePrice.exFactoryPrice != null ||  zonePrice.exFactoryPrice > 0) 
                    && zonePrice.insuranceChargeFixed !=null && zonePrice.insuranceChargeFixed !=0)
                    {
                    //let InsuranceAmount = zonePrice.exFactoryPrice + zonePrice.insuranceChargeFixed;
                    let gstonInsurance= this.caluculateGST(zonePrice.insuranceChargeFixed , zonePrice.insuranceGst);
                    zonePrice.insuranceTotal=zonePrice.insuranceChargeFixed + gstonInsurance; 
                    zonePrice.insuranceChargeInPercentage=null;
                    //document.getElementById("insuranceAmount").innerHTML =InsuranceAmount + gstonInsurance;
                    //console.log(InsuranceAmount + " , " + gstonInsurance);
                    }
                    else if(zonePrice.insuranceChargeInPercentage !=null){
                      this.calculateInsuranceCost(productid,zoneId);
    
                    }
                    else{
                      zonePrice.insuranceTotal=0;
                    }
                   // zonePrice.landingPrice=this.calculateBuyerLandingPrice(productid,zoneId);
                    }
                    /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */

     caluculateGST(amount, percentage){
       if(percentage == null){
         percentage = 0;
       }
      return amount*(percentage * .01);
      }
      /**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
       caluculatePercentageValue(amount, percentage){
         if(percentage == null){
           percentage = 0;
         }
      return amount*(percentage * .01);
      }
/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
mapZoneIdToName(id:string):string{
  debugger;
  let result="";
// let data = this.zoneList.filter(item=>item._id == id);
// if(data !=null){
// result=data[0].name;
// }
return result;

}
//#region Error handler
private checkUnauthorized(handledError: HandledErrorResponse) : void {
  this.toast.error(handledError.message);

  if (handledError.code == 401) {
    AuthService.logout();
    this.router.navigate(['/login']);
  }
}
//#endregion

  
}
