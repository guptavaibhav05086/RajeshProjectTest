import { Component, OnInit,Input ,AfterViewInit,Output} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { parse } from 'path';

@Component({
  selector: 'app-edit-price-manufacturer',
  templateUrl: './edit-price-manufacturer.component.html',
  styleUrls: ['./edit-price-manufacturer.component.css']
})
export class EditPriceManufacturerComponent implements OnInit {
@Input() name;
@Input() ProductList : any; 
@Input() productPricingZone:any;
pageStart:number =0 ;
pageEnd:number = 5;
pageSelected:number=1;
pageSize = 5;

//@Output() dateRange = new EventEmitter<any>();
dateRange={
fromDate:Date,
toDate:Date
};
productPricingBackup:any;
isCurrentRange:boolean;
radioBoxSelection=[
  {
      id: 1,
      description: 'currentMonth'
  },
  {
      id: 2,
      description: 'nextMonth'
  },
  {
    id: 3,
    description: 'dateRange'
}
];
selectedOption={
  id: 0,
  description: ''
}
disbaleDate:boolean;
disableToDate:boolean;
//mappedProductList : any;

  constructor(public activeModal: NgbActiveModal) {
    //alert(this.name);
    this.disbaleDate=true;
    this.disableToDate=true;
   }

  ngOnInit() {
    debugger;
    //alert(this.ProductList);
    console.log(this.ProductList);
    if(this.ProductList !=null){
      this.ProductList = this.ProductList.filter(item=> item._id==this.name);
      this.productPricingZone = this.getProductFuturePrice(this.productPricingZone.filter(item=> item.product._id==this.name));
      this.productPricingBackup=this.productPricingZone;

    }
    
    //alert(this.name);
  }

  getStatusClass(Status:string){
if(Status == "Current"){
return 'displayGreen'
}
else if(Status == "Upcoming"){
  return 'displayOrange'
}
  }
  /**
 * Comment for method checkDateRangeFuture.
 * @param dateFrom  filter parameter.
 * @param dateFrom  filter dateTo.
 * @returns       Comment for return value.
 */
  ngAfterViewInit(){
    //alert(this.name);
  }

  onPageChange(){
    this.pageStart = (this.pageSelected-1) * this.pageSize
    this.pageEnd = this.pageStart + this.pageSize;
    }
  rangeSelection(dateType:string){
    debugger;
    if(this.dateRange.toDate == null|| this.dateRange.fromDate == null){
      this.productPricingZone=this.productPricingBackup;

    }
    if(dateType =="fromDate"){
      if (this.dateRange.toDate != null && this.dateRange.toDate.toString() != ""){
        let year= parseInt(this.dateRange.fromDate.toString().split('-')[0]);
        let month = parseInt(this.dateRange.fromDate.toString().split('-')[1]);
        let date=parseInt(this.dateRange.fromDate.toString().split('-')[2]);
        let toYear= parseInt(this.dateRange.toDate.toString().split('-')[0]);
        let toMonth = parseInt(this.dateRange.toDate.toString().split('-')[1]);
        let toDate=parseInt(this.dateRange.toDate.toString().split('-')[2]);
        let firstDay = new Date(year, month-1, date);
        let lastDay = new Date(toYear,toMonth-1,toDate);
        this.disableToDate=false;
        if(firstDay > lastDay){
          alert('To Date Should be Greater then From Date');
          return;

        }
        //let fromDate=this.formatDate(firstDay);
        //let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //let toDate= this.formatDate(lastDay);
        if(this.dateRange.toDate.toString().split('-')[1]){
          this.productPricingZone = this.getDateRange(this.productPricingBackup,firstDay,lastDay);

        }
        

      }
      else{
        this.productPricingZone=this.productPricingBackup;
        this.disableToDate=false;
      }
    }
    else {
      if (this.dateRange.fromDate != null && this.dateRange.fromDate.toString() != ""){
        let year= parseInt(this.dateRange.fromDate.toString().split('-')[0]);
        let month = parseInt(this.dateRange.fromDate.toString().split('-')[1]);
        let date=parseInt(this.dateRange.fromDate.toString().split('-')[2]);
        let toYear= parseInt(this.dateRange.toDate.toString().split('-')[0]);
        let toMonth = parseInt(this.dateRange.toDate.toString().split('-')[1]);
        let toDate=parseInt(this.dateRange.toDate.toString().split('-')[2]);
        let firstDay = new Date(year, month-1, date);
        let lastDay = new Date(toYear,toMonth-1,toDate);
        this.disableToDate=false;
        if(firstDay > lastDay){
          alert('To Date Should be Greater then From Date');
          return;

        }
        //let fromDate=this.formatDate(firstDay);
        //let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //let toDate= this.formatDate(lastDay);
        if(this.dateRange.toDate.toString().split('-')[1]){
          this.productPricingZone = this.getDateRange(this.productPricingBackup,firstDay,lastDay);

        }

      }
      else{
        this.productPricingZone=this.productPricingBackup;

      }

    }

  }
  /**
 * Comment for method checkDateRangeFuture.
 * @param dateFrom  filter parameter.
 * @param dateFrom  filter dateTo.
 * @returns       Comment for return value.
 */
updateRange(product:any){
// this.dateRange.emit(
//   {
//     validateStart:product.validityStartTime,
//     validateEnd:product.validityEndTime
//   }
//   );
}
  /**
 * Comment for method checkDateRangeFuture.
 * @param dateFrom  filter parameter.
 * @param dateFrom  filter dateTo.
 * @returns       Comment for return value.
 */

  getProductFuturePrice(priceList:any[]):Array<any>{
    debugger;
  let result=new Array< any>();
for(let i=0;i < priceList.length;i++){
  //debugger;
  if(this.checkDateRangeFuture(priceList[i].validityStartTime,priceList[i].validityEndTime)){
    priceList[i].validityStartTimeDisplay = this.formatDate(priceList[i].validityStartTime);
    priceList[i].validityEndTimeDisplay=this.formatDate(priceList[i].validityEndTime);

     //For sorting Purpose get dates in order 
     priceList[i].validitySortByStartTime = this.getDateValue(priceList[i].validityStartTime);
     priceList[i].validitySortByEndTime = this.getDateValue(priceList[i].validityEndTime);

    if(this.isCurrentRange)
    {
      priceList[i].Status="Current";

    }
    else{
      priceList[i].Status="Upcoming";

    }
   
    result.push(priceList[i]);
  }

}
// sorting logic for result array 
result.sort(function (a, b) {
  return a.validitySortByStartTime - b.validitySortByStartTime;
});
console.log("Result array: " + result);
return result;
}

/**
 * Comment for method checkDateRangeFuture.
 * @param dateFrom  filter parameter.
 * @param dateFrom  filter dateTo.
 * @returns       Comment for return value.
 */
getDateRange(priceList:any[],rangeStart,rangeEnd):Array<any>{
  let result=new Array< any>();
for(let i=0;i < priceList.length;i++){
  if(this.checkDateRange(priceList[i].validityStartTime,priceList[i].validityEndTime,rangeStart,rangeEnd)){
    result.push(priceList[i]);
  }

}
return result;
}

/**
 * Comment for method checkDateRangeFuture.
 * @param dateFrom  filter parameter.
 * @param dateFrom  filter dateTo.
 * @returns       Comment for return value.
 */
formatDate(date:any):string{
  //debugger;
  let dateCheck = new Date();
      
  let d1 = date.split("-");
  
    d1[2]=d1[2].split("T")[0];
    let resutl = d1[2] + "/" + (parseInt(d1[1])) + "/" + d1[0];
    return resutl;
  
  //var c = dateCheck.split("-");
  
  //let from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
  
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
/**
 * Comment for method checkDateRangeFuture.
 * @param dateFrom  filter parameter.
 * @param dateFrom  filter dateTo.
 * @returns       Comment for return value.
 */
checkDateRangeFuture(dateFrom,dateTo):boolean{
    try 
    {
      
      let dateCheck = new Date();
      // let d1 = dateFrom.split("/");
      // let d2 = dateTo.split("/");
      let d1 = dateFrom.split("-");
      let d2 = dateTo.split("-");
      
        d1[2]=d1[2].split("T")[0];
        d2[2]=d2[2].split("T")[0];
      
      //var c = dateCheck.split("-");
      
      let from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
      let to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
      let check =dateCheck ;
      
      
      if(check <= from ){
        this.isCurrentRange=false;
      return true;
      
      }
      else if(check >= from && check <= to){
        this.isCurrentRange=true;
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

/**
 * Comment for method Filter on ManufacturerId.
 * @param manufacturerId  filter parameter.
 * @returns       Comment for return value.
 */
checkDateRange(dateFrom,dateTo,rangeStart,rangeEnd):boolean{
  try 
  {
    
    let dateCheck = new Date();
    let d1 = dateFrom.split("-");
      let d2 = dateTo.split("-");
      
        d1[2]=d1[2].split("T")[0];
        d2[2]=d2[2].split("T")[0];
    // // let d1 = dateFrom.split("/");
    // // let d2 = dateTo.split("/");
    
    let from = new Date(d1[0], parseInt(d1[1])-1, d1[2]);  // -1 because months are from 0 to 11
    let to   = new Date(d2[0], parseInt(d2[1])-1, d2[2]);
    let check =dateCheck ;
    
    if(rangeStart <= from &&  to <= rangeEnd){
      return true;
      }
      
      // if(rangeStart <= from && rangeEnd >= to){
      // return true;
      // }
      // if(rangeStart <= from){
      //   return true;
      //   }
      else{
      return false;
      }
    // if(rangeStart <= from && from <= rangeEnd){
    // return true;
    // }
    // // if(rangeStart <= from && rangeEnd >= to){
    // // return true;
    // // }
    // // if(rangeStart <= from){
    // //   return true;
    // //   }
    // else{
    // return false;
    // }
  }
  catch{
  console.log("Error");
  }
    
    }
  
  radioButtonSelection(selected){
    debugger;
    this.selectedOption=this.radioBoxSelection.filter(item=> item.id == selected.id)[0];
    if(this.selectedOption.id ==3){
      this.disbaleDate=false;
      //this.productPricingZone=this.getDateRange()

    }
    else{
      if(this.selectedOption.id ==2){
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
       
        //let fromDate=this.formatDate(firstDay);
        //let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //let toDate= this.formatDate(lastDay);
        this.productPricingZone = this.getDateRange(this.productPricingBackup,firstDay,lastDay);
        this.dateRange.fromDate=null;
        this.dateRange.toDate=null;


      }
      else{
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
       
        //let fromDate=this.formatDate(firstDay);
        //let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //let toDate= this.formatDate(lastDay);
        this.productPricingZone = this.getDateRange(this.productPricingBackup,firstDay,lastDay);
        this.dateRange.fromDate=null;
        this.dateRange.toDate=null;


      }
      this.disbaleDate=true;
      this.disableToDate=true;
    }

  }

}
