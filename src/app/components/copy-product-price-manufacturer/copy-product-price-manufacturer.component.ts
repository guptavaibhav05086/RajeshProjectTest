import { Component, OnInit,Input,ViewChild,AfterViewInit,ViewChildren,QueryList,ElementRef  } from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { parse } from 'path';
@Component({
  selector: 'app-copy-product-price-manufacturer',
  templateUrl: './copy-product-price-manufacturer.component.html',
  styleUrls: ['./copy-product-price-manufacturer.component.css']
})
export class CopyProductPriceManufacturerComponent implements OnInit {
  @ViewChild('mainCheckbox',{ read: ElementRef }) mainCheckbox:ElementRef;
  @ViewChildren('childCheckBox',{ read: ElementRef }) childCheckBox: QueryList<ElementRef>;
  @Input() manufacturerList;
  @Input() subcategoriesList;
  @Input() productType;
  @Input() brandList;
  @Input() mappedProductList;
  @Input() name;
  @Input() product;
  backupProductList :any;
  disbaleCopy:boolean = false;
  selectAll:boolean;
  filterObject={
    manuId:'All',
    prodType:'All',
    brand:'All',
    subCat:'All'
  }
  selectedProducts:Array<string>;
  returnResult={
    currentProduct:'',
    rateToCopiedProducts:[]
  };

  pageStart:number =0 ;
pageEnd:number = 4;
pageSelected:number=1;
pageSize = 5;
  constructor(public activeModal: NgbActiveModal) { 
    this.selectedProducts = new Array<string>();
  }

  ngOnInit() {
    debugger;
    if(this.mappedProductList !=null){
      this.product = this.mappedProductList.filter(item=> item._id==this.name)[0];
      this.mappedProductList = this.mappedProductList.filter(data=> data._id != this.name);
      if(this.mappedProductList == null || this.mappedProductList.length ==0 ){
        this.disbaleCopy = true;

      }
      else{
        this.disbaleCopy =false;
      }
     this.returnResult.currentProduct=this.name;
     this.backupProductList = this.mappedProductList;
     

    }
  }
  onPageChange(){
    this.pageStart = (this.pageSelected-1) * this.pageSize
    this.pageEnd = this.pageStart + this.pageSize;
    }

  copySelectAll(input:HTMLInputElement){
   let selectd = input.checked;
   this.ManagecheckBoxSelectAll(selectd);
  }
  ManagecheckBoxSelectAll(flag:boolean){
    this.selectedProducts = new Array<string>();
    let index =0 ;
    if(flag == true){

      let checkLength = this.childCheckBox.length;
      for(let i=0;i< checkLength;i++){
        this.childCheckBox.toArray()[i].nativeElement.checked = true;

      }
      this.mappedProductList.forEach(element => {
        this.selectedProducts.push(element._id);        
      });


    }
    else{
      let checkLength = this.childCheckBox.length;
      for(let i=0;i< checkLength;i++){
        this.childCheckBox.toArray()[i].nativeElement.checked = false;

      }

    }
    this.returnResult.rateToCopiedProducts=this.selectedProducts;
  }
  copyCheckBoxSeelection(input:HTMLInputElement,prodId:string){
    debugger;
    if(input.checked == true){
      this.selectedProducts.push(prodId);
      if(this.mappedProductList != null && this.mappedProductList.length == this.selectedProducts.length){
        this.selectAll = true;

      }
      

    }
    else{
      this.selectedProducts = this.selectedProducts.filter(item=> item != prodId);
      this.selectAll = false;
      //document.getElementById('mainCheckbox').checked = false;
    }
    this.returnResult.rateToCopiedProducts=this.selectedProducts;

  }

  filter(){
    this.ManagecheckBoxSelectAll(false);
    this.mappedProductList=this.backupProductList;
    if(this.filterObject.manuId != "All"){
      //this.mappedProductList=this.backupProductList;
      this.mappedProductList = this.mappedProductList.
  filter(item=>item.manufacturer._id == this.filterObject.manuId ); 
    }
    if(this.filterObject.brand != "All"){
      //this.mappedProductList=this.backupProductList;
      this.mappedProductList = this.mappedProductList.
      filter(item=>item.brand._id == this.filterObject.brand );
  
    }
    
    if(this.filterObject.prodType != "All"){
     // this.mappedProductList=this.backupProductList;
      this.mappedProductList = this.mappedProductList.
      filter(item=>item.type._id == this.filterObject.prodType );
  
    }
    if(this.filterObject.subCat != "All"){
      //this.mappedProductList=this.backupProductList;
      this.mappedProductList = this.mappedProductList.
    filter(item=>item.subCategory._id == this.filterObject.subCat );
  
    }
    
    if(this.filterObject.brand == "All" && this.filterObject.manuId=="All" && this.filterObject.prodType=="All" && this.filterObject.subCat == "All" ){
      this.mappedProductList=this.backupProductList;
    }
    
    
  }
  
}
