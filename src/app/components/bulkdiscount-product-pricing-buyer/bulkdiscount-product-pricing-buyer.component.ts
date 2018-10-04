import { Component, OnInit,Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DiscountSlabs } from '../../models/DiscountSlabs';
import { Product } from '../../models/Product';
import { Discount } from '../../models/Discount';
import { BulkPurchaseDiscount } from '../../models/BulkPurchaseDiscount';

@Component({
  selector: 'app-bulkdiscount-product-pricing-buyer',
  templateUrl: './bulkdiscount-product-pricing-buyer.component.html',
  styleUrls: ['./bulkdiscount-product-pricing-buyer.component.css']
})
export class BulkdiscountProductPricingBuyerComponent implements OnInit {
  
  @Input() product :Product;
  @Input() ProductList : Product[];
  @Input() name;
  @Input() zoneId;
  discountSlab:Array<Discount>;
  selectedDisconut : BulkPurchaseDiscount;
  selectedZoneMRP:number = 0;

  radioBoxApplicableSelection=[
    {
        id: 1,
        description: 'EntireCategory'
    },
    {
        id: 2,
        description: 'EntireSubCategory'
    },
    {
      id: 3,
      description: 'ForThisSKU'
  }
  ];
  selectedApplicableOption={
    id: 0,
    description: ''
  }
  radioBoxCalculationSelection=[
    {
      id: 1,
      description: 'QuantityWise'
  },
    {
        id: 2,
        description: 'SaleValueWise'
    },
    
  ];
  selectedCalculationOption={
    id:0 ,
    description: ''
  }
  constructor(public activeModal: NgbActiveModal) {
    this.discountSlab = new Array<Discount>()
    //this.initiateDiscountSlab(null);
   }

  ngOnInit() {
    debugger;
    if(this.ProductList !=null){
      
      this.product = this.ProductList.filter(item=> item._id==this.name)[0];
      let selectedZone =  this.product.manuFacturerPriceMapping.zonePrices.
      filter(item => item.pricingZone._id == this.zoneId)[0];
      this.selectedZoneMRP = selectedZone.minimumRetailPrice;
       this.selectedDisconut = this.product.manuFacturerPriceMapping.zonePrices.
      filter(item => item.pricingZone._id == this.zoneId)[0].bulkPurchaseDiscount;
      if(this.selectedDisconut != null){
        if(this.selectedDisconut.discounts != null){
          for(let i=0 ;i < this.selectedDisconut.discounts.length;i++ ){
            this.initiateSlabs(this.selectedDisconut.discounts[i]);

          }
          //this.discountSlab = this.selectedDisconut.discounts;

        }
        else{
          this.discountSlab = new Array<Discount>()
        }
        if(this.selectedDisconut.calculationBasedOn != undefined){
          this.selectedCalculationOption = this.radioBoxCalculationSelection.filter(item => item.description == this.selectedDisconut.calculationBasedOn)[0];

        }
        if(this.selectedDisconut.applicableTo != undefined){
          this.selectedApplicableOption = this.radioBoxApplicableSelection.filter(item=> item.description == this.selectedDisconut.applicableTo)[0];
        }
        
      }
      else{
        this.selectedDisconut = new BulkPurchaseDiscount();
      }
      

    }
  }

  // initiateDiscountSlab(slabData:any){
  //   this.discountSlab = new Array<Discount>()
  //   if(slabData == null){
  //     this.addNewSlab();

  //   }
  //   else{
  //     this.discountSlab = slabData;
  //   }

  // }
  initiateSlabs(slabData:Discount){
    let objSlab = new Discount();
    if(this.discountSlab.length>0){
      objSlab.slabId = (this.discountSlab[this.discountSlab.length-1].slabId + 1);
  }
  else{
    objSlab.slabId=1;
  }  
    
    
    objSlab.isEditClicked=false;
    objSlab.rate=slabData.rate;
    objSlab.slabFrom=slabData.slabFrom;
    objSlab.slabTo=slabData.slabTo;
    objSlab.discount=slabData.discount;
    this.discountSlab.push(objSlab);
  }
  
  calculateDiscount(slabId,slabrate:any) {
      let value  = this.discountSlab.filter(item=> item.slabId == slabId)[0];
      let rate = value.rate;
      let rat = rate;
      

    if(this.selectedZoneMRP != undefined && value.rate != null){
     //value.discount = (this.selectedZoneMRP / slabrate* 100)
     value.discount = 100 - (slabrate / this.selectedZoneMRP * 100);

    }
    else{
      value.discount=0;
    }
    

  } 
  addNewSlab(){
    let objSlab = new Discount();
    if(this.discountSlab.length>0){
      objSlab.slabId = (this.discountSlab[this.discountSlab.length-1].slabId + 1);
  }
  else{
    objSlab.slabId=1;
  }  
    
    
    objSlab.isEditClicked=false;
    this.discountSlab.push(objSlab);
    if(this.selectedDisconut !=null && this.selectedDisconut !=undefined){
      this.selectedDisconut.discounts = this.discountSlab;
    }
    
  }

  removeSlab(slabId:number){
    debugger;
    this.discountSlab = this.discountSlab.filter(item=> item.slabId != slabId);
    this.selectedDisconut.discounts = this.discountSlab;
  }
  updateRecords(){
    this.selectedDisconut.discounts = this.discountSlab;
  }

  togggleEdit(slabId:number){

    let selSlab= this.discountSlab.filter(item=> item.slabId == slabId)[0];
    if(selSlab.isEditClicked){
      selSlab.isEditClicked = false;

    }
    else{
      selSlab.isEditClicked=true;

    }
  }

  radioButtonSelection(selected){
    debugger;
    this.selectedApplicableOption=this.radioBoxApplicableSelection.filter(item=> item.id == selected.id)[0];
    this.selectedDisconut.applicableTo = this.selectedApplicableOption.description;

  }
  radioButtonSelectionCalculation(selected){
    debugger;
    this.selectedCalculationOption=this.radioBoxCalculationSelection.filter(item=> item.id == selected.id)[0];
    this.selectedDisconut.calculationBasedOn = this.selectedCalculationOption.description;

  }

}
