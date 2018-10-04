import { Component, OnInit, Input, ViewChild, AfterViewInit, ViewChildren, QueryList, ElementRef, SimpleChanges } from '@angular/core';
import { CompanyBasicDetails } from './../../models/CompanyBasicDetails'
import { Proprietor } from './../../models/Proprietor'
import { DeliveryAddress } from './../../models/DeliveryAddress'
import { InvoiceAddress } from './../../models/InvoiceAddress'
import { State } from './../../models/States'
import { BankInformation } from './../../models/BankInformation'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MSupplyCommonDataService } from '../../services/m-supply-common-data.service';
import { MsupplyFormRegistrationService } from '../../services/msupply-form-registration.service'
import { OtherInformation } from '../../models/OtherInformation';
import { SalesPerson } from '../../models/salesPerson';
import { TermsOfTrade } from '../../models/TermsOfTrade';
import { CurrentProductDetail } from '../../models/CurrentProductDetail';
import { DocumentsAndAttachments } from '../../models/DocumentsAndAttachments';
//import { AwsuploadService } from '../../services/awsupload.service'
import { Address } from '../../models/Address';
import { ContactPerson } from '../../models/ContactPerson';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { City } from '../../models/City';
import { ActivatedRoute } from '@angular/router';
import { BuyerProductPriceZoneMappingComponent } from './../buyer-product-price-zone-mapping/buyer-product-price-zone-mapping.component'
import { ProductserviceService } from '../../services/productservice.service';
import { ManufacturerService } from './../../services/manufacturers/manufacturer.service'
import { Manufacturer } from '../../models/manufacturer';
import { ManufacturersWithCategories } from "./../../models/manufacturers/manufacturersWithCategories"
import { ProductsData } from '../../models/Product'
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { Router } from '@angular/router';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { BuyerService } from '../../services/buyers/buyer.service';
import { BuyerProductsRequest } from '../../models/buyers/buyerProductsRequest';
import { BuyerProduct } from '../../models/buyers/buyerProduct';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { elementAt } from '../../../../node_modules/rxjs/operators';
import { AddressLocation } from '../../models/addressLocation';
import { DeliveryAddressZoneMapping } from 'src/app/models/buyers/deliveryAddressZoneMapping';

@Component({
    selector: 'app-basic-details',
    templateUrl: './buyer-registration.component.html',
    styleUrls: ['./buyer-registration.component.css']
})
export class BasicDetailsComponent implements OnInit {
    public loading = false;
    @Input()
    loadCompanyDetails: CompanyBasicDetails;

    @ViewChild('cheque', { read: ElementRef })
    chequeUploded: any;
    @ViewChild('chequeName', { read: ElementRef })
    chequeName: any;
    @ViewChildren('uploadDoc', { read: ElementRef }) docList: QueryList<ElementRef>;
    @ViewChildren('uploadDocNames', { read: ElementRef }) docNames: QueryList<ElementRef>;
    @ViewChild('buyerForm')
    registrationForm: HTMLFormElement;
    newCompanyDetails: CompanyBasicDetails;
    proprietorList: Array<Proprietor>;
    deliveryAddressList: Array<DeliveryAddress>;
    docAttach: Array<DocumentsAndAttachments>;
    invoiceAddress: InvoiceAddress;
    bankInfo: BankInformation;
    otherInfo: OtherInformation;
    curProdDetails: Array<CurrentProductDetail>;
    termOfTrade: TermsOfTrade;
    trackControls: number;
    selectedCities: Array<string>;
    statesCities: Array<State>;
    flagFormValid: boolean;
    buyerId: string;
    gstinPattern = "^([0][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$";
    panPattern = "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}";
    noDecimal = "^[0-9]*$";
    decimalUptoTwo = "^[0-9]*.?([0-9]{0,2})";
    minDateForDatePicker = {
        year: 1900,
        month: 1,
        date: 1
    };
    ShowBuyerProductMappingSection: boolean;
    hideErrorMessage:boolean = false;
    selectedManufacturer: string;
    manufacturerList: ManufacturersWithCategories;
    manufacturerProductListBackUp : any;
    maxDate: any;
    buyer: CompanyBasicDetails;
    manufacturerProducts: ProductsData
    public isEditForm = false;
    public validateOnce =true;
    //public loading: boolean;
    public showNextProductButton : boolean;
    public selectAllProducts:boolean; 
    public selectedCount:number;
    public compnaySearchPhrase:string;
public isPageEdited:boolean;
    constructor(private _msupplyService: MSupplyCommonDataService,
        private _msupplyFormService: MsupplyFormRegistrationService,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private productService: ProductserviceService,
        private buyerService: BuyerService,
        private manufacturerService: ManufacturerService, 
        private toast: ToastService, 
        private router: Router
    ) {
        this.buyerId = this.route.snapshot.queryParams['id'] || null;
        console.log("GAURVA " + this.buyerId);
        //this.buyerId="";
        this.newCompanyDetails = new CompanyBasicDetails();
        this.proprietorList = new Array<Proprietor>();
        this.deliveryAddressList = new Array<DeliveryAddress>();
        this.curProdDetails = new Array<CurrentProductDetail>();
        this.docAttach = new Array<DocumentsAndAttachments>();
        this.otherInfo = new OtherInformation();
        this.termOfTrade = new TermsOfTrade();
        this.bankInfo = new BankInformation();
        this.curProdDetails = new Array<CurrentProductDetail>();
        this.statesCities = new Array<State>();
        this.maxDate = this.getMaxDateOfBirth();
        this.ShowBuyerProductMappingSection = false;
        this.selectedManufacturer = "";
        this.manufacturerList = new ManufacturersWithCategories();
        this.selectAllProducts = false;
        this.isPageEdited=false;
    }


    ngOnInit() {
        debugger;
        this.loading =true;
        this.showNextProductButton = false;
        if (this.buyerId == null || this.buyerId == "") {
            this.loadNewForm();
            this.hideErrorMessage = true;
            this._msupplyFormService.getStatesAndCities().subscribe(itemStates => {
                debugger;
                this.statesCities = itemStates.data;
                console.log(itemStates.data);
                this.invoiceAddress.states = this.statesCities;
                this.deliveryAddressList[0].states = this.statesCities;
                this.proprietorList[0].states = this.statesCities;

                 this.loading = false;

            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            });

        }
        else {
            this.showNextProductButton = true;
            let reqData = new CompanyBasicDetails();

            this._msupplyFormService.getBuyerRegistrationForm(this.buyerId).subscribe(companyDetails => {
                debugger;
                try {
                    this.statesCities = companyDetails.data.states;
                    reqData = companyDetails.data.buyers[0];
                    if (reqData != null) {
                        this.isEditForm = true;
                        this.loadEditFormData(reqData);
                        debugger;
                        this.buyer = reqData;
                        this.selectedCount = this.buyer.products.length;
                        console.log(this.buyer);
                    }
                    else {
                        this.toast.error('Buyers Details not found');
                        //alert('Buyers Details not found');
                        this.loadNewForm();
                    }
                    this.loading = false;

                } catch (error) {
                    this.loading = false;
                    this.loadNewForm();
                }
                this.hideErrorMessage = true;

                //this.newCompanyDetails=data[0];
            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            });


        }




    }
    ngAfterViewChecked() {
       // debugger;
        if(this.isEditForm && this.validateOnce ){
          this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
          this.registrationForm.form.controls['chequeUpload'].status = "VALID";
          for(let j =0 ;j < this.proprietorList.length;j++ ){
              let proprietor = this.proprietorList[j];
              var propDobId = "pDOB" + (proprietor.ProprietorID -1);
              if(this.registrationForm.form.controls[propDobId] != undefined){
                this.registrationForm.form.controls[propDobId].setErrors({'incorrect': false});
                this.registrationForm.form.controls[propDobId].status = "VALID";
              }
              
  
            }
          this.validateOnce =false;
        }
        else if(this.validateOnce){
          for(let j =0 ;j < this.proprietorList.length;j++ ){
              let proprietor = this.proprietorList[j];
              var propDobId = "pDOB" + (proprietor.ProprietorID -1);
              if(this.registrationForm.form.controls[propDobId] != undefined){
                this.registrationForm.form.controls[propDobId].setErrors({'incorrect': false});
                this.registrationForm.form.controls[propDobId].status = "VALID";
              }
  
            }
            this.validateOnce =false;
        }
        
    //   console.log(this.docNames.toArray());
      // this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
      // this.registrationForm.form.controls['chequeUpload'].status = "VALID";
      //this.registrationForm.form.controls['pemail0'].setErrors(null);
    }
    ngAfterViewInit(){
        //debugger;
        for(let i=0;i < this.docAttach.length;i++){
            let itemDoc = this.docAttach[i];
           
          if(this.docNames !=undefined){
              if(itemDoc.fileUrl != undefined && itemDoc.fileUrl != null){
                let arraySplit = itemDoc.fileUrl.split('/');
                this.docNames.toArray()[itemDoc.DocId -1 ].nativeElement.value = arraySplit[arraySplit.length-1];
    
              }
              
          }

        }
      
        debugger;
      console.log(this.docNames.toArray());
        //this.docNames
      // this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
      // this.registrationForm.form.controls['chequeUpload'].status = "VALID";

    }

    

    setValidationImageLoad(elemId: string, url: string) {
        if (url != "" && url != null) {
            this.registrationForm.form.controls[elemId].setErrors(null);

        }

    }

    //#region Buyer
formatDate(dateValue):any{
var date = new Date(dateValue);
let month = date.getMonth().toString();
let day = date.getDay().toString();


if(month.toString().length  == 1 ){
    month= "0" + month.toString();

  }
  if(day.toString().length ==1){
    day = "0" + day;
  }
  let result = date.getFullYear() + '-' + month + "-" + day;
return result;
}
    /**
     * Comment for method loadEditForm.
     * @param Void  Need to be deleted.
     * @returns       Comment for return value.
     */
    loadEditFormData(reqData: CompanyBasicDetails) {
        this.proprietorList = new Array<Proprietor>();
        this.deliveryAddressList = new Array<DeliveryAddress>();
        this.curProdDetails = new Array<CurrentProductDetail>();
        this.docAttach = new Array<DocumentsAndAttachments>();
        this.otherInfo = new OtherInformation();
        this.termOfTrade = new TermsOfTrade();
        this.bankInfo = new BankInformation();
        //this.curProdDetails=new Array<CurrentProductDetail>();
        if (reqData != null) {
            //debugger;
            this.initiateCompanyDetails(reqData);
            this.initiateBankDetails(reqData.bankInformation);
            this.initiateInvoiceDetails(reqData.invoiceAddress);
            this.initiateOtherInfo(reqData.otherInformation);
            //data not coming from api currently

debugger;
            this.termOfTrade = reqData.termsOfTrade;
            this.termOfTrade.chequeDate = this.formatDate(this.termOfTrade.chequeDate);
            if (reqData.deliveryAddresses != null && reqData.deliveryAddresses.length > 0) {
                for (let i = 0; i < reqData.deliveryAddresses.length; i++) {
                    this.addNewDeliverySection(reqData.deliveryAddresses[i]);
                }

            }
            else {
                this.addNewDeliverySection(null);
            }
            if (reqData.proprietors != null && reqData.proprietors.length > 0) {
                for (let i = 0; i < reqData.proprietors.length; i++) {
                    this.addNewPropriterSection(reqData.proprietors[i]);
                }

            }
            else {
                this.addNewPropriterSection(null);
            }
            if (reqData.documentsAndAttachments != null && reqData.documentsAndAttachments.length > 0) {
                for (let i = 0; i < reqData.documentsAndAttachments.length; i++) {
                    this.addDocumentAttachment(reqData.documentsAndAttachments[i]);
                }

            }
            else {
                this.addDocumentAttachment(null);
            }
            if (reqData.otherInformation != null && reqData.otherInformation.currentProducts != null && reqData.otherInformation.currentProducts.length > 0) {
                for (let j = 0; j < reqData.otherInformation.currentProducts.length; j++) {
                    this.addCurrentProducts(reqData.otherInformation.currentProducts[j]);


                }

            }
            else {
                this.addCurrentProducts(null);
            }

        }


    }

    /**
   * Comment for method loadEditForm.
   * @param Void  Need to be deleted.
   * @returns       Comment for return value.
   */
    loadNewForm() {

        this.initiateCompanyDetails(null);
        this.addNewPropriterSection(null);
        this.addNewDeliverySection(null);
        this.initiateInvoiceDetails(null);
        this.initiateBankDetails(null);
        this.addDocumentAttachment(null);
        this.addCurrentProducts(null);
        this.initiateOtherInfo(null);
    }
    /**
   * Comment for method loadEditForm.
   * @param Void  Need to be deleted.
   * @returns       Comment for return value.
   */
    formatFormJsonData() {
        this.proprietorList.forEach(element => {
            if(element.dobDatePicker !=null && element.dobDatePicker !=undefined){
                element.dateOfBirth = this.getDateFormProp(element.dobDatePicker);
            }
            });
            // if(this.newCompanyDetails._id == undefined || this.newCompanyDetails._id == null){
            //     this.newCompanyDetails._id = this.buyerId;
            // }
        //this.checkJSON();   
        this.newCompanyDetails.bankInformation = this.bankInfo;
        this.newCompanyDetails.deliveryAddresses = this.deliveryAddressList;
        this.newCompanyDetails.proprietors = this.proprietorList;
        this.newCompanyDetails.invoiceAddress = this.invoiceAddress;
        this.newCompanyDetails.otherInformation = this.otherInfo;
        this.newCompanyDetails.termsOfTrade = this.termOfTrade;
        this.newCompanyDetails.documentsAndAttachments = this.docAttach;
        //this.curProdDetails.
        this.newCompanyDetails.otherInformation.currentProducts = this.curProdDetails;
        //this.newCompanyDetails.
        console.log(JSON.stringify(this.newCompanyDetails));
        //this.newCompanyDetails.
    }
checkJSON(){
    if(this.newCompanyDetails.cinNumber == "" || this.newCompanyDetails.cinNumber == null){
        this.newCompanyDetails.cinNumber =  " ";
    }
    if(this.newCompanyDetails.websiteUrl == "" || this.newCompanyDetails.websiteUrl == null){
        this.newCompanyDetails.websiteUrl =  " ";
    }
    if(this.newCompanyDetails.emailId == "" || this.newCompanyDetails.emailId == null){
        this.newCompanyDetails.emailId =  " ";
    }
    if(this.invoiceAddress.contactPerson.name == "" || this.invoiceAddress.contactPerson.name == null){
        this.invoiceAddress.contactPerson.name =  " ";
    }
    if(this.invoiceAddress.contactPerson.emailId == "" || this.invoiceAddress.contactPerson.emailId == null){
        this.invoiceAddress.contactPerson.emailId =  " ";
    }
    if(this.invoiceAddress.contactPerson.designation == "" || this.invoiceAddress.contactPerson.designation == null){
        this.invoiceAddress.contactPerson.designation =  " ";
    }
    if( this.invoiceAddress.contactPerson.mobileNumber == null){
        this.invoiceAddress.contactPerson.mobileNumber =  1234567890;
    }

   this.proprietorList.forEach(item=> {
    if(item.name == "" || item.name == null){
        item.name =  " ";
    }
    if(item.emailId == "" || item.emailId == null){
        item.emailId =  " ";
    }
    if(item.mobileNumber == null){
        item.mobileNumber =  1234567890;
    }
    if(item.emailId == "" || item.emailId == null){
        item.name =  " ";
    }

    if(item.address.city == " " || item.address.city == null){
        item.address.city =  " ";
    }
    if(item.address.state == " " || item.address.state == null){
        item.address.state =  " ";
    }
    if(item.address.line1 == " " || item.address.line1 == null){
        item.address.line1 =  " ";
    }
    if(item.address.line2 == " " || item.address.line2 == null){
        item.address.line2 =  " ";
    }
    if(item.address.pincode == null){
        item.address.pincode =  123456;
    }
   


   });

    
}
getDateFormProp(dobPicker){
    var date = new Date(dobPicker.year,(dobPicker.month-1),dobPicker.day);
//var date = dobPicker.day + " " + dobPicker.month + " " + dobPicker.year;
return date;
}
    SaveDetails() {
        debugger;
        this.formatFormJsonData();
        if (this.buyerId == null || this.buyerId == "") {
            this.loading = true;

            //alert('Details saved successfully');
            this._msupplyFormService.createBuyerForm(this.newCompanyDetails).subscribe(res => {
                if(res["errors"] != null){
                    let errMsg:string = res["errors"][0];
                    this.toast.error(res["errors"][0]);
                  
                }
                else {
                    this.toast.success('Details saved successfully')
                    console.log(res);
                    this.buyer = res.data;
                    this.buyerId = this.buyer._id;
                    this.getSalesPerson();
                    console.log(this.buyerId);
                    console.log("Buyer ID inside the Create call " + this.buyerId);
                    this.ShowBuyerProductMapping();
                    
                }
                this.loading =false;


            },
                error => {
                    //this.loading = false;
                    this.loading =false;

                    let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                    this.checkUnauthorized(handledError);
                }
            );

        }
        else {
            this.loading = true;

            if(this.buyerId !=null && this.buyerId !=undefined){
                this.newCompanyDetails._id = this.buyerId;
            }
            console.log(this.newCompanyDetails._id);
            this._msupplyFormService.updateBuyerForm(this.newCompanyDetails).subscribe(result => {
                this.loading=false;
                if(result["errors"] != null){
                    let errMsg:string = result["errors"][0];
                    this.toast.error(result["errors"][0]);
                }
                else{
                    this.toast.success('Details saved successfully')
                    //alert('Details saved successfully');
                    console.log(result);
                    this.buyer = result.data;
                    this.getSalesPerson();
                    this.ShowBuyerProductMapping();
                }
               
            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            }
            );
        }

    }

    /**
  * Comment for method loadEditForm.
  * @param Void  Need to be deleted.
  * @returns       Comment for return value.
  */
    initiateOtherInfo(_otherInfo: OtherInformation) {
        if (_otherInfo != null) {
            this.otherInfo.billingSoftware = _otherInfo.billingSoftware;
            this.otherInfo.turnOver = _otherInfo.turnOver;
            if(_otherInfo.salesPerson  != null && _otherInfo.salesPerson  != undefined ){
                this.otherInfo.salesPerson = _otherInfo.salesPerson;
            }else{
                this.otherInfo.salesPerson = new SalesPerson();
            }
            
        }else{
            this.otherInfo.salesPerson = new SalesPerson();
        }
        this.newCompanyDetails.otherInformation = new OtherInformation();
        this.newCompanyDetails.otherInformation.salesPersonList=new Array<string>();
        this.getSalesPerson();
    }
    /**
   * Comment for method loadEditForm.
   * @param Void  Need to be deleted.
   * @returns       Comment for return value.
   */
    initiateBankDetails(_bankInformation: BankInformation) {

        this.bankInfo.ACType = this._msupplyService.getAccountType();
        this.bankInfo.isChecqueSizeValid = true;
        this.bankInfo.isChecqueValid = true;
        this.bankInfo.isReenterValid = true;
        this.bankInfo.accountType = null;
       // this.bankInfo.ACType=null;
        if (_bankInformation != null) {
            this.bankInfo._id = _bankInformation._id;
            this.bankInfo.accountHolderName = _bankInformation.accountHolderName;
            this.bankInfo.accountNumber = _bankInformation.accountNumber;
            this.bankInfo.chequeImageUrl = _bankInformation.chequeImageUrl;
            this.bankInfo.ifscCode = _bankInformation.ifscCode;
            this.bankInfo.ReEnterAccountNumber = _bankInformation.accountNumber;
            this.bankInfo.accountType = _bankInformation.accountType;
            if(this.bankInfo.chequeImageUrl !=null && this.bankInfo.chequeImageUrl !=""){
                let arraySplit = this.bankInfo.chequeImageUrl.split('/');
                this.chequeName.nativeElement.value = arraySplit[arraySplit.length-1];
                // this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
                // this.registrationForm.form.controls['chequeUpload'].status = "VALID";

               // element.pricingSheetName = arraySplit[arraySplit.length-1]; 
              }


        }
    }
    /**
   * Comment for method loadEditForm.
   * @param Void  Need to be deleted.
   * @returns       Comment for return value.
   */
    initiateInvoiceDetails(_invoceDetails: InvoiceAddress) {

        this.invoiceAddress = new InvoiceAddress();
        let address = new Address();
        let contactPerson = new ContactPerson();
        this.invoiceAddress.address = address;
        this.invoiceAddress.address.city=null;
        this.invoiceAddress.address.state=null;
        this.invoiceAddress.contactPerson = contactPerson;
        this.invoiceAddress.isPinValid = true;
        this.invoiceAddress.selectedCities = new Array<City>();
        //this.invoiceAddress.se
        // let listStates = new States();
        // listStates.state="Uttar Pradesh";
        // listStates.cities=['Farrukhabad','Lucknow','Kanpur','Banares'];
        this.invoiceAddress.states = new Array<State>();
        this.invoiceAddress.states = this.statesCities;
        // this.invoiceAddress.states.push(listStates);
        //debugger;
        this.invoiceAddress.isMobileValid = true;
        this.invoiceAddress.isEmailValid = true;
        if (_invoceDetails != null) {

            if (_invoceDetails.address != null && _invoceDetails.address != undefined) {
                this.invoiceAddress.address = _invoceDetails.address;
                //this.invoiceAddress.address.state=this.invoiceAddress.address.stateId;
                //this.invoiceAddress.address.city=this.invoiceAddress.address.cityId;

            }
            if (_invoceDetails.contactPerson != null && _invoceDetails.contactPerson != undefined) {
                this.invoiceAddress.contactPerson = _invoceDetails.contactPerson;
            }
            this.invoiceAddress.selectedState = this.statesCities.filter(item => item._id == this.invoiceAddress.address.state)[0];
            if (this.invoiceAddress.selectedState != null) {
                this.invoiceAddress.selectedCities = this.invoiceAddress.selectedState.cities;
                this.invoiceAddress.selectedCity = this.invoiceAddress.selectedCities.filter(city => city._id == this.invoiceAddress.address.city)[0];
                if (this.invoiceAddress.selectedCity == null) {
                    this.invoiceAddress.selectedCity = new City();
                    this.invoiceAddress.selectedCity.name = null;

                }

            }



        }
    }



    /**
   * Comment for method loadEditForm.
   * @param Void  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
    addDocumentAttachment(_docAttach: DocumentsAndAttachments) {
        let itemDoc = new DocumentsAndAttachments();
        if (this.docAttach.length > 0) {
            itemDoc.DocId = (this.docAttach[this.docAttach.length - 1].DocId + 1);
        }
        else {
            itemDoc.DocId = 1;
        }
        itemDoc.isDocSizeValid = true;
        itemDoc.isDocValid = true;

        if (_docAttach != null) {
            itemDoc.documentName = _docAttach.documentName;
            itemDoc.fileName = _docAttach.fileName;
            itemDoc.fileUrl = _docAttach.fileUrl;

        }
        this.docAttach.push(itemDoc);

    }

    /**
    * Comment for method loadEditForm.
    * @param Void  Comment for parameter ´target´.
    * @returns       Comment for return value.
    */
    deleteDocumentAttachment(docId: number) {
        this.docAttach = this.docAttach.filter(item => item.DocId != docId);
    }

    getSalesPerson(){
        debugger;
        this._msupplyFormService.getSalesPersonData().subscribe(res=> {
            if(res["data"] !=undefined && res["errors"] == null){
                this.newCompanyDetails.otherInformation.salesPersonList = res.data;
                console.log(res.data);
                console.log("Seller List");
                console.log(this.newCompanyDetails.otherInformation.salesPersonList )
                // var temp = []
                // this.newCompanyDetails.otherInformation.salesPersonList.forEach(item =>{
                //     if(item != null && item["name"] != undefined){
                //         temp.push(item);
                //     }
                // });
                // this.newCompanyDetails.otherInformation.salesPersonList = temp;
            }
            else{
                console.log(res["errors"]);
            }
            
            //this

        });
    }
    /**
  * Comment for method loadEditForm.
  * @param Void  Comment for parameter ´target´.
  * @returns       Comment for return value.
  */
    addCurrentProducts(_curnProd: CurrentProductDetail) {
        let curProd = new CurrentProductDetail();
        if (this.curProdDetails.length > 0) {
            curProd.ProductId = (this.curProdDetails[this.curProdDetails.length - 1].ProductId + 1);
        }
        else {
            curProd.ProductId = 1;
        }
        if (_curnProd != null) {
            curProd.brand = _curnProd.brand;
            curProd.category = _curnProd.category;
            curProd.sale = _curnProd.sale;
        }
        this.curProdDetails.push(curProd);
    }
    /**
    * Comment for method loadEditForm.
    * @param Void  Comment for parameter ´target´.
    * @returns       Comment for return value.
    */
    deleteCurrentProducts(prodId: number) {
        this.curProdDetails = this.curProdDetails.filter(item => item.ProductId != prodId);
    }


    /**
   * Comment for method loadEditForm.
   * @param Void  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
    loadEditForm() {

    }

    /**
   * Comment for method validateBankInfo.
   * @param target  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
    validateBankInfo(elemId: any) {
        this.bankInfo.validateBankInfo();
        if (this.bankInfo.isReenterValid) {
            this.registrationForm.form.controls[elemId].setErrors({ 'incorrect': false });
            this.registrationForm.form.controls[elemId].status="VALID";
        }
        else {
            this.registrationForm.form.controls[elemId].setErrors({ 'incorrect': true });
            this.registrationForm.form.controls[elemId].status="INVALID";
        }
    }

    /**
   * Comment for method mobileNumberValidation.
   * @param target  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
    mobileNumberValidation(type: string) {
        this.newCompanyDetails.Validations(type);
    }

    /**
  * Comment for method initiateCompanyDetails.
  * @param target  Comment for parameter ´target´.
  * @returns       Comment for return value.
  */
    initiateCompanyDetails(_companyDetails: CompanyBasicDetails) {
        this.newCompanyDetails = new CompanyBasicDetails();
        this.newCompanyDetails.EstablishedYear = new Array<string>();
        this.newCompanyDetails.established = null;
        this.newCompanyDetails.BusinessTypes = this._msupplyService.getBusinessType();
        console.log("ANISH")
        console.log(this.newCompanyDetails.BusinessTypes)
        this.newCompanyDetails.businessType = null;
        this.newCompanyDetails.LegalStatuses = this._msupplyService.getLegalStatuses();
        console.log(this.newCompanyDetails.LegalStatuses)
        this.newCompanyDetails.EstablishedYear = this._msupplyService.getEstablishedYearDropDown();
        this.newCompanyDetails.legalStatus = null;
        this.newCompanyDetails.loanAssistanceRequired = false;
        this.newCompanyDetails.isMobileValid = true;
        this.newCompanyDetails.isLandlineVaid = true;
        this.newCompanyDetails.isLogoImageSizeValid = true;
        this.newCompanyDetails.isLogoImageValid = true;
        this.newCompanyDetails.isPhoto1ImageSizeValid = true;
        this.newCompanyDetails.isPhoto1ImageValid = true;
        this.newCompanyDetails.isPhoto2ImageValid = true;
        this.newCompanyDetails.isPhoto2ImageSizeValid = true;
        //this.newCompanyDetails.seqCode = 0;
        // this.newCompanyDetails.seqCode = 0;
        if (_companyDetails != null) {
            this.newCompanyDetails._id = _companyDetails._id;
            this.newCompanyDetails.allowmSupplyToCallOrSMS = _companyDetails.allowmSupplyToCallOrSMS;
            this.newCompanyDetails.businessType = _companyDetails.businessType;
            this.newCompanyDetails.cinNumber = _companyDetails.cinNumber;
            this.newCompanyDetails.companyName = _companyDetails.companyName;
            this.newCompanyDetails.createdAt = _companyDetails.createdAt;
            this.newCompanyDetails.emailId = _companyDetails.emailId;
            this.newCompanyDetails.gstIn = _companyDetails.gstIn;
            this.newCompanyDetails.landLineNumber = _companyDetails.landLineNumber;
            this.newCompanyDetails.legalStatus = _companyDetails.legalStatus;
            this.newCompanyDetails.loanAmount = _companyDetails.loanAmount;
            this.newCompanyDetails.loanAssistanceRequired = _companyDetails.loanAssistanceRequired;
            this.newCompanyDetails.logoUrl = _companyDetails.logoUrl;
            this.newCompanyDetails.mobileNumber = _companyDetails.mobileNumber;
            this.newCompanyDetails.panNumber = _companyDetails.panNumber;
            this.newCompanyDetails.photo1Url = _companyDetails.photo1Url;
            this.newCompanyDetails.photo2Url = _companyDetails.photo2Url;
            this.newCompanyDetails.established = _companyDetails.established;
            this.newCompanyDetails.websiteUrl = _companyDetails.websiteUrl;
            this.newCompanyDetails.password = _companyDetails.password;
            this.newCompanyDetails.seqCode=_companyDetails.seqCode;
            this.setValidationImageLoad('logoUpload', this.newCompanyDetails.photo1Url);
            this.setValidationImageLoad('imageUpload', this.newCompanyDetails.photo1Url);
            this.setValidationImageLoad('imageUpload2', this.newCompanyDetails.photo2Url);



        }
    }

    /**
   * Comment for method addNewPropriterSection.
   * @param target  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
    addNewPropriterSection(_proprietor: Proprietor) {
        //debugger;
        //let proprietor=null;
        let proprietor = new Proprietor();
        let newAdd = new Address();
        proprietor.address = newAdd;
        if (this.proprietorList.length > 0) {
            proprietor.ProprietorID = (this.proprietorList[this.proprietorList.length - 1].ProprietorID + 1);
        }
        else {
            proprietor.ProprietorID = 1;
        }
        proprietor.IsStateValid = true;
        proprietor.isCityValid = true;
        proprietor.isPinValid = true;
        proprietor.selectedState = new State();
        proprietor.selectedCities = new Array<City>();
        proprietor.selectedCity = new City();
        proprietor.isMobileValid = true;
        proprietor.isEmailValid = true;
        proprietor.isDOBValid = true;
        // let listStates = new States();
        // listStates.state="Uttar Pradesh";
        // listStates.cities=['Farrukhabad','Lucknow','Kanpur','Banares'];
        proprietor.states = new Array<State>();
        //proprietor.states=this.statesCities
        proprietor.states = this.statesCities;
        proprietor.address.state=null;
        proprietor.address.city=null;
        //proprietor.states.push(listStates);
        //debugger;
        if (_proprietor != null) {
            proprietor.address = _proprietor.address;
            //proprietor.address.state=proprietor.address.stateId;
            //proprietor.address.city=proprietor.address.cityId;
            proprietor._id = _proprietor._id;
            proprietor.name = _proprietor.name;
            proprietor.selectedState = this.statesCities.filter(item => item._id == _proprietor.address.state)[0];
            if (proprietor.selectedState != null) {
                proprietor.selectedCities = proprietor.selectedState.cities;
                proprietor.selectedCity = proprietor.selectedCities.filter(city => city._id == _proprietor.address.city)[0];
                if (proprietor.selectedCity == null) {
                    proprietor.selectedCity = new City();
                    proprietor.selectedCity.name = null;

                }

            }
            //debugger;
            //let NgbDateStruct=
            proprietor.dobDatePicker = this._msupplyService.getDateFormatForBSDateControl(_proprietor.dateOfBirth);

            
            //this._msupplyService.getDateFormatForBSDateControl(_proprietor.dateOfBirth);
            //proprietor.dateOfBirth=new NgbDateStruct();
            //this._msupplyService.getDateFormatForBSDateControl(_proprietor.dateOfBirth);
            //proprietor.dateOfBirth=_proprietor.dateOfBirth;
            proprietor.emailId = _proprietor.emailId;
            proprietor.mobileNumber = _proprietor.mobileNumber;
            //pro

        }
        this.proprietorList.push(proprietor);

    }

    /**
     * Comment for method addNewDeliverySection.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    addNewDeliverySection(_deliveryAdd: DeliveryAddress) {
        debugger;
        let address = new DeliveryAddress();
        let objAdd = new Address();
        let contactP = new ContactPerson();
        address.address = objAdd;
        address.contactPerson = contactP;
        address.useAsInvoice = false;


        if (this.deliveryAddressList.length > 0) {
            address.DeliveryID = (this.deliveryAddressList[this.deliveryAddressList.length - 1].DeliveryID + 1);
        }
        else {
            address.DeliveryID = 1;

        }
        address.IsStateValid = true;
        address.isCityValid = true;
        address.isPinValid = true;
        address.address.state = null;
        address.selectedCities = new Array<City>();
        address.address.city = null;
        address.isMobileValid = true;
        address.isMobileFilled = true;
        address.isEmailValid = true;
        address.isEmailFilled = true;
        address.isContactPersonValid = true;
        address.isDesignationValid = true;
        address.isAddressLine1Valid = true;
        // let listStates = new States();
        // listStates.state="Uttar Pradesh";
        // listStates.cities=['Farrukhabad','Lucknow','Kanpur','Banares'];
        address.states = new Array<State>();
        address.states = this.statesCities;
        // address.states.push(listStates);
        if (_deliveryAdd != null) {
            address._id = _deliveryAdd._id;
            address.address = _deliveryAdd.address;
            address.contactPerson = _deliveryAdd.contactPerson;
            //address.address.state=address.address.stateId;
            // address.address.city=address.address.cityId;
            address.selectedState = this.statesCities.filter(item => item._id == address.address.state)[0];
            if (address.selectedState != null) {
                address.selectedCities = address.selectedState.cities;
                address.selectedCity = address.selectedCities.filter(city => city._id == address.address.city)[0];
                if (address.selectedCity == null) {
                    address.selectedCity = new City();
                    address.selectedCity.name = null;

                }
                else{
                    address.selectedLocations = address.selectedCities.find(function (obj) { return obj._id === address.address.city }).locations;
                    //address

                }

            }
            


        }
        this.deliveryAddressList.push(address);
        console.log(this.deliveryAddressList);
    }
    /**
     * Comment for method addNewDeliverySection.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    removeDeliverySection(delId: number) {
        this.deliveryAddressList = this.deliveryAddressList.filter(item => item.DeliveryID != delId);
    }
    /**
     * Comment for method addNewDeliverySection.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    removeProprietorSection(delId: number) {
        this.proprietorList = this.proprietorList.filter(item => item.ProprietorID != delId);
    }
    /**
     * Comment for validateProprietor.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    validateCompanyBasicDetails(type: string, elemId: any) {
        // this.testMethod();//To be deleted
        debugger;
        let result = this.newCompanyDetails.Validations(type);
        if (result == false && type == "email") {

            this.registrationForm.form.controls[elemId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "email") {

            //this.registrationForm.form.controls[elemId].setErrors(null);
        }
        if (result == false && type == "mobile") {

            this.registrationForm.form.controls[elemId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "mobile") {

            this.registrationForm.form.controls[elemId].setErrors(null);
        }
    }
    validateProprietorDOB(event: any, propId: number, type: string, elemId: any) {
        let updatedProp = this.proprietorList.find(function (obj) { return obj.ProprietorID === propId; });
        updatedProp.dateOfBirth = event;

        let result = updatedProp.ValidateAddress(type);

        if (result == false && type == "dob") {
            let tempId = 'pDOB' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "dob") {
            let tempId = 'pDOB' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
    }
    /**
   * Comment for validateProprietor.
   * @param target  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
    validateProprietor(propId: number, type: string, elemId: any) {
        debugger;
        let updatedProp = this.proprietorList.find(function (obj) { return obj.ProprietorID === propId; })
        let result = updatedProp.ValidateAddress(type);

        if (result == false && type == "dob") {
            let tempId = 'pDOB' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "dob") {
            let tempId = 'pDOB' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (result == false && type == "email") {
            let tempId = 'pemail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "email") {
            let tempId = 'pemail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (result == false && type == "pin") {
            let tempId = 'proPinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "pin") {
            let tempId = 'proPinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (result == false && type == "mobile") {
            let tempId = 'pMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "mobile") {
            let tempId = 'pMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (type == "state") {
            updatedProp.selectedCities = new Array<City>();
            updatedProp.address.state = updatedProp.states.find(function (obj) { return obj._id === updatedProp.address.state })._id;
            //updatedProp.address.state=updatedProp.address.stateId;
            updatedProp.selectedCities = updatedProp.states.find(function (obj) { return obj._id === updatedProp.address.state }).cities;
            updatedProp.address.cityId = null;
        }
        else if (type == "state") {
            updatedProp.selectedCities = new Array<City>();
        }
        if (type == "city") {
            //updatedProp.address.city=updatedProp.address.cityId;
            //updatedProp.address.cityId=updatedProp.selectedCities.find(function(obj){return obj.name === updatedProp.address.city})._id;
        }

    }

    /**
    * Comment for copyInvoiceAddress.
    * @param deliveryId  This is the id for the delivery address whose data will be 
    * copied in Invoice address .
    * @returns       Comment for return value.
    */
    copyInvoiceAddress1(deliveryId: number, status: boolean) {

        let selectedAddress = this.deliveryAddressList.find(function (obj) { return obj.DeliveryID === deliveryId; })
        let allSelectedInvoicesAddress = this.deliveryAddressList.filter(add => add.DeliveryID != deliveryId);
        for (let i = 0; i < allSelectedInvoicesAddress.length; i++) {
            allSelectedInvoicesAddress[i].useAsInvoice = false;
        }
        if (status) {
            //selectedAddress.useAsInvoice = status;
            this.invoiceAddress.address = selectedAddress.address;
            this.invoiceAddress.selectedCities = selectedAddress.selectedCities;
            this.invoiceAddress.states = selectedAddress.states;
            this.invoiceAddress.contactPerson = selectedAddress.contactPerson;
        }
        else {

            //selectedAddress.useAsInvoice = status;
            let address = new Address();
            let contactP = new ContactPerson();
            this.invoiceAddress.address = address;
            this.invoiceAddress.contactPerson = contactP;

            this.invoiceAddress.selectedCities = new Array<City>();

        }
        this.validateInvoiceAddress('pin', 'invoicePinCode');
        this.validateInvoiceAddress('mobile', 'invoiceMNumber');
        this.validateInvoiceAddress('email', 'invoiceEmail')

    }
    copyInvoiceAddress(deliveryId: number, status: boolean){
    let selectedAddress = this.deliveryAddressList.find(function (obj) { return obj.DeliveryID === deliveryId; })
    let allSelectedInvoicesAddress = this.deliveryAddressList.filter(add => add.DeliveryID != deliveryId);
    for (let i = 0; i < allSelectedInvoicesAddress.length; i++) {
        allSelectedInvoicesAddress[i].useAsInvoice = false;
    }
    if (status) {
        //selectedAddress.useAsInvoice = status;
        this.invoiceAddress.address.line1 = selectedAddress.address.line1;
        this.invoiceAddress.address.line2=selectedAddress.address.line2;
        //this.invoiceAddress.address.
        //this.invoiceAddress.address = selectedAddress.address;
        this.invoiceAddress.selectedCities = selectedAddress.selectedCities;
        this.invoiceAddress.states = selectedAddress.states;
        this.invoiceAddress.address.state = selectedAddress.address.state;
        this.invoiceAddress.address.city=selectedAddress.address.city;
        this.invoiceAddress.address.pincode=selectedAddress.address.pincode;
        this.invoiceAddress.address.location = selectedAddress.address.location;
        this.invoiceAddress.address.locationObj = selectedAddress.address.locationObj;
        this.invoiceAddress.contactPerson.name=selectedAddress.contactPerson.name;
        this.invoiceAddress.contactPerson.designation=selectedAddress.contactPerson.designation;
        this.invoiceAddress.contactPerson.emailId=selectedAddress.contactPerson.emailId;
        this.invoiceAddress.contactPerson.landLineNumber=selectedAddress.contactPerson.landLineNumber;
        this.invoiceAddress.contactPerson.mobileNumber=selectedAddress.contactPerson.mobileNumber;
        //this.invoiceAddress.contactPerson = selectedAddress.contactPerson;
    }
    else {

        //selectedAddress.useAsInvoice = status;
        let address = new Address();
        let contactP = new ContactPerson();
        this.invoiceAddress.address = address;
        this.invoiceAddress.contactPerson = contactP;

        this.invoiceAddress.selectedCities = new Array<City>();

    }
    this.validateInvoiceAddress('pin', 'invoicePinCode');
    this.validateInvoiceAddress('mobile', 'invoiceMNumber');
    this.validateInvoiceAddress('email', 'invoiceEmail');
}
    /**
    * Comment for validateProprietor.
    * @param target  Comment for parameter ´target´.
    * @returns       Comment for return value.
    */
    getMaxDateOfBirth(): any {
        let todaysDate = new Date();

        let maxDate = {
            year: todaysDate.getFullYear() - 18,
            month: todaysDate.getMonth() + 1,
            day: todaysDate.getDate()


        }
        return maxDate;
    }

    /**
    * Comment for validateProprietor.
    * @param target  Comment for parameter ´target´.
    * @returns       Comment for return value.
    */
    validateInvoiceAddress(type: string, tempId) {
        let result = this.invoiceAddress.ValidateInvoiceAddress(type);
        if (result == false && type == "email") {
            //let tempId='pemail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "email") {
            //let tempId='pemail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (result == false && type == "pin") {
            //let tempId='proPinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "pin") {
            // let tempId='proPinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (result == false && type == "mobile") {
            //let tempId='pMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "mobile") {
            //let tempId='pMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (type == "state") {
            this.invoiceAddress.selectedCities = new Array<City>();
            let selectedState = this.invoiceAddress.address.state;
            //this.invoiceAddress.address.stateId=this.invoiceAddress.states.find(function(obj){return obj._id===  selectedState})._id;
            //this.invoiceAddress.address.state=this.invoiceAddress.address.stateId;
            this.invoiceAddress.selectedCities = this.invoiceAddress.states.find(function (obj) { return obj._id === selectedState }).cities;
            this.invoiceAddress.address.city = null;
        }
        else if (type == "state") {
            this.invoiceAddress.selectedCities = new Array<City>();
        }
        if (type == "city") {
            // let selectedCity = this.invoiceAddress.address.city;
            // this.invoiceAddress.address.cityId=this.invoiceAddress.selectedCities.find(function(obj){
            //     return obj.name === selectedCity
            // })._id;
            // this.invoiceAddress.address.city=this.invoiceAddress.address.cityId;
        }
    }
    /**
  * Comment for validateProprietor.
  * @param target  Comment for parameter ´target´.
  * @returns       Comment for return value.
  */

    validateDeliveryAdddress(deliveryId: number, type: string, elemId: any) {
        let updatedDelAddress = this.deliveryAddressList.find(function (obj) { return obj.DeliveryID === deliveryId; })
        let result = updatedDelAddress.ValidateDeliveryAddress(type);
        if (result == false && type == "email") {
            let tempId = 'demail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "email") {
            let tempId = 'demail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (result == false && type == "pin") {
            let tempId = 'pinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "pin") {
            let tempId = 'pinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (result == false && type == "mobile") {
            let tempId = 'dMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors({ 'incorrect': true });
        }
        else if (result && type == "mobile") {
            let tempId = 'dMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if (type == "state") {
            updatedDelAddress.selectedCities = new Array<City>();
            updatedDelAddress.address.stateId = updatedDelAddress.states.find(function (obj) { return obj._id === updatedDelAddress.address.state })._id;
            updatedDelAddress.selectedCities = updatedDelAddress.states.find(function (obj) { return obj._id === updatedDelAddress.address.state }).cities;
            updatedDelAddress.address.cityId = null;
            updatedDelAddress.selectedLocations=null;
        }
        else if (type == "state") {
            updatedDelAddress.selectedCities = new Array<City>();
        }
        if (type == "city") {
            updatedDelAddress.selectedLocations = new Array<AddressLocation>();
            //updatedDelAddress.address.location
            updatedDelAddress.selectedLocations= updatedDelAddress.selectedCities.find(function (obj) { return obj._id === updatedDelAddress.address.city }).locations;

        }
    }
    /**
   * Comment for method fileSelect.
   * @param target  Comment for parameter ´target´.
   * @returns       Comment for return value.
   */
    fileSelect(images: FileList, name: string) {
        var result = '';
        var file;
        debugger;
        for (var i = 0; file = images[i]; i++) {
            // if the file is not an image, continue
            if (!this.validateFiles(name, file)) {
                if (!this.newCompanyDetails.isPhoto1ImageValid
                    || !this.newCompanyDetails.isPhoto2ImageValid
                    || !this.newCompanyDetails.isLogoImageValid) {
                    this.toast.error('File  should be an Image');
                    //alert("File  should be an Image");
                }
                else {
                    this.toast.error('File Size should be less then 5 MB');
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
                debugger;
                if (name == "photo1") {
                    this.newCompanyDetails.photo1Url = data.url;

                }
                else if (name == "photo2") {
                    this.newCompanyDetails.photo2Url = data.url;

                }
                else if (name == "logoInfo") {
                    this.newCompanyDetails.logoUrl = data.url;

                }
                this.toast.success('File Uploaded Successfully');
            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            }
            );
            reader.readAsDataURL(file);
            //this._awsupload.uploadfile(file);
        }

    }

    /**
    * Comment for method fileSelect.
    * @param target  Comment for parameter ´target´.
    * @returns       Comment for return value.
    */
    uploadMultiplefileSelect(files: FileList, docId: number) {
        let ext = files[0].name.split('.')[1];
        let file = files[0];
        let id = "docUpload" + (docId - 1);
        let selectedDocAttach = this.docAttach.filter(item => item.DocId == docId);
        let item = this.docList;
        this.docNames.toArray()[docId - 1].nativeElement.value = file.name;

        if (file.type.match('image.*') || ext == "doc" || ext == "docx" || ext == "pdf" || ext == "xls" || ext == "xlsx") {
            selectedDocAttach[0].isDocValid = true;

            this._msupplyFormService.postMsupplyFiles(file, name).subscribe(data => {
                debugger;
                selectedDocAttach[0].fileUrl = data.url;
                this.toast.success('File Uploaded Successfully');

            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            }
            );

        }
        else {
            selectedDocAttach[0].isDocValid = false;
            //this.docList[0].value="";
            //this.registrationForm.form.controls[id].nativeElement.value="";
            //this.registrationForm.con
            this.docList.toArray()[docId - 1].nativeElement.value = "";
            this.toast.error('Invalid File Format');
            this.docNames.toArray()[docId - 1].nativeElement.value = "";
            //document.getElementById(id).innerHTML=document.getElementById(id).innerHTML;
            return;
            //files[0]=null;
        }
        if (file.size > 5000000) {
            selectedDocAttach[0].isDocSizeValid = false;
            this.docList.toArray()[docId - 1].nativeElement.value = "";
            this.toast.error('File size exceeds 5 MB');
            this.docNames.toArray()[docId - 1].nativeElement.value = "";
            //this.chequeUploded.nativeElement.value = "";


        }
        else {
            selectedDocAttach[0].isDocSizeValid = true;

        }

    }
    /**
     * Comment for method fileSelect.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    selectCheque(files: File, name: string) {
        debugger;
        let ext = files[0].name.split('.')[1];
        let file = files[0];
        this.chequeName.nativeElement.value = file.name;

        if (file.type.match('image.*') || ext == "doc" || ext == "docx" || ext == "pdf" || ext == "xls" || ext == "xlsx") {

            this.bankInfo.isChecqueValid = true;



            this._msupplyFormService.postMsupplyFiles(file, name).subscribe(data => {
                debugger;
                this.bankInfo.chequeImageUrl = data.url;
                this.toast.success('File Uploaded Successfully');

            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            }
            );


        }
        else {
            this.bankInfo.isChecqueValid = false;
            this.chequeUploded.nativeElement.value = "";
            this.toast.error('Invalid File Format');
            this.chequeName.nativeElement.value = "";
            return;
            //files[0]=null;
        }
        if (file.size > 5000000) {
            this.bankInfo.isChecqueSizeValid = false;
            this.chequeUploded.nativeElement.value = "";
            this.toast.error('File size exceeds 5 MB');
            this.chequeName.nativeElement.value = "";


        }
        else {
            this.bankInfo.isChecqueSizeValid = true;

        }
    }
    /**
     * Comment for method fileSelect.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    validateFiles(name: string, file: File): boolean {
        if (name == "photo1") {
            if (!file.type.match('image.*')) {

                this.newCompanyDetails.isPhoto1ImageValid = false;
                return false;
            }
            else {
                this.newCompanyDetails.isPhoto1ImageValid = true;

            }
            if (file.size > 5000000) {
                this.newCompanyDetails.isPhoto1ImageSizeValid = false;

                return false;

            }
            else {
                this.newCompanyDetails.isPhoto1ImageSizeValid = true;

            }

        }
        else if (name == "photo2") {
            if (!file.type.match('image.*')) {

                this.newCompanyDetails.isPhoto2ImageValid = false;
                return false;
            }
            else {
                this.newCompanyDetails.isPhoto2ImageValid = true;

            }
            if (file.size > 5000000) {
                this.newCompanyDetails.isPhoto2ImageSizeValid = false;

                return false;

            }
            else {
                this.newCompanyDetails.isPhoto2ImageSizeValid = true;

            }
        }
        else if (name == "logo") {
            if (!file.type.match('image.*')) {

                this.newCompanyDetails.isLogoImageValid = false;
                return false;
            }
            else {
                this.newCompanyDetails.isLogoImageValid = true;

            }
            if (file.size > 5000000) {
                this.newCompanyDetails.isLogoImageSizeValid = false;

                return false;

            }
            else {
                this.newCompanyDetails.isLogoImageSizeValid = true;

            }

        }

        return true;
    }
    //#endregion

    //#region Buyer products

    ShowBuyerProductMapping() {
        this.selectedManufacturer = "";
        this.ShowBuyerProductMappingSection = true;
        this.getManufacturer();
    }

    ShowBuyerPanel() {
        this.ShowBuyerProductMappingSection = false;
    }

    getManufacturer() {
        this.loading = true
        this.manufacturerService.getAllManufacturersWithCategories().subscribe(res => {
            this.loading = false;
            if (!res.isValid) {
                this.toast.error(res.errors[0])
                return;
            }

            this.manufacturerList = res.data;
            //this.manufacturerList.manufacturers.filter(item=> item.status == "Active");
            ///this.manufacturerListBackUp = JSON.parse(JSON.stringify(this.manufacturerList));
        },
        error => {
            this.loading = false;

            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
        }
    );
    }

    GetProductsByManufacturer() {
        debugger;
        console.log(this.buyer.products);
        var txt;
        let flag = true;
        if(this.isPageEdited){
           flag= confirm("Are you sure to leave this page without saving the selected product details ?");
        }
       
    if (flag) {
        this.loading = true;

        this.productService.getProductsByManufacturer(this.selectedManufacturer).subscribe(res => {
            this.loading = false;
            if (!res.isValid) {
                this.toast.error(res.errors[0])
                return;
            }

            this.manufacturerProducts = res.data;
            this.manufacturerProducts.products = this.manufacturerProducts.products.filter(item=> item.status == "Active");
            this.manufacturerProductListBackUp = new ProductsData();
            this.manufacturerProductListBackUp = res.data;
            this.mapBuyerManufactorerProducts();
            console.log(this.buyer.products);
            this.isPageEdited=false;
        },
        error => {
            this.loading = false;

            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
        })
    } else {
        
    }
        
    }

    public CreateBackUpList(){

    }
public selectAll(flag){
    debugger;
    if(flag){
        
        this.manufacturerProducts.products.forEach(productItem => {
            productItem.isChecked = true;
        });
        this.selectedCount = this.manufacturerProducts.products.length;
    }
    else{
        this.manufacturerProducts.products.forEach(productItem => {
            productItem.isChecked = false;
        });
        this.selectedCount = 0;
    }

}
public selectProduct(flag){
if(flag){
this.selectedCount = this.selectedCount + 1;
}
else{
    this.selectedCount = this.selectedCount - 1;
}

this.isPageEdited = true;
this.selectAllProducts=false;
if(this.manufacturerProducts.products.length == this.selectedCount){
    this.selectAllProducts=true;
}

}
    public saveAndUpdateProducts() : void {
        //this.productService.getProductCategoryByManufacturer(this.selectedManufacturer).subscribe()
       //this.toast.success("Buyer Products updated!");
        debugger;
        let buyerProductsModel: BuyerProductsRequest = new BuyerProductsRequest();
        buyerProductsModel._id = this.buyerId;
        buyerProductsModel.products = [];

        this.manufacturerProducts.products.forEach(productItem => {
            if (productItem.isChecked) {
                productItem.isSubmitted=true;
              let buyerProduct = new BuyerProduct();
              let prod = this.buyer.products.filter(ele=> ele.product == productItem._id)[0];
              if(prod != null){
                
                buyerProduct.addressZoneMapping = prod.addressZoneMapping;
                buyerProduct.product=prod.product;
      
              }
              else{
                
                buyerProduct.product = productItem._id;
                let addZoneMapping = new Array<DeliveryAddressZoneMapping>();
                buyerProduct.addressZoneMapping = addZoneMapping;

              }
      
              //only map zone to clicked product
            //   if(productItem._id == this.product._id){
            //     buyerProduct.addressZoneMapping = this.addressZoneMapping;
            //   }
              
              
              buyerProductsModel.products.push(buyerProduct);
            }
            else{
              //Removing unchecked item of current manufacturer present in buyer products array
              this.buyer.products = this.buyer.products.filter(ele=> ele.product != productItem._id);
              
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
            let locObj = this.buyer.deliveryAddresses;

            this.buyer = res.data;
            this.buyer.deliveryAddresses = locObj;
            this.mapBuyerManufactorerProducts();
            this.toast.success("Buyer Products updated!");
            this.isPageEdited = false;
        },
        error => {
            debugger;
            this.loading = false;

            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
        })
    }

    LinkBuyerProductPriceZone(productIndex) {
        debugger;
        this._msupplyFormService.getBuyerRegistrationForm(this.buyerId).subscribe(companyDetails => {
            debugger;
            try {
               
                let reqData = companyDetails.data.buyers[0];
                if (reqData != null) { 
                    //let locObj = this.buyer.deliveryAddresses;

                    this.buyer = reqData;   
                    //this.buyer.deliveryAddresses = locObj;                  
                    this.openLinkingPopup(productIndex);                                            
                }
               

            } catch (error) {
                this.loading = false;
                this.loadNewForm();
            }

            //this.newCompanyDetails=data[0];
        },
        error => {
            this.loading = false;

            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
        });
        
    }

    openLinkingPopup(productIndex){
       debugger;
        let productDetails = this.manufacturerProducts.products[productIndex];
        console.log("241414141");
        console.log(productDetails);
        console.log(this.manufacturerProducts.priceZones);
        //console.log(this.buyer.deliveryAddresses);                                                  
        const modalRef = this.modalService.open(BuyerProductPriceZoneMappingComponent, { size: 'lg' });
        modalRef.componentInstance.buyer = this.buyer;
        modalRef.componentInstance.product = productDetails;
        modalRef.componentInstance.manufacturerProducts = this.manufacturerProducts;;
        //modalRef.componentInstance.pricingZones = this.manufacturerProducts.priceZones;
        modalRef.componentInstance.pricingZones = this.manufacturerProducts.priceZones.filter(item=>{ return (item.manufacturer ==productDetails.manufacturer._id && item.subCategory == productDetails.subCategory._id)}) ;
       // modalRef.componentInstance.priceZones = modalRef.componentInstance.priceZones.filter(item => item.)
        modalRef.result.then(result => {
            if(result != 'Cross click'){
                debugger;
            let productDetails = this.manufacturerProducts.products[productIndex];
            let filterProd = this.buyer.products.filter(item => item.product == productDetails._id)[0];
            if(filterProd != undefined){
                filterProd.addressZoneMapping = result;

            }
            else{
                filterProd = new BuyerProduct();
                filterProd.product = productDetails._id;
                filterProd.addressZoneMapping = result;
                this.buyer.products.push(filterProd);
            }
            
            filterProd.addressZoneMapping = filterProd.addressZoneMapping.filter(item=> item.pricingZone != "");
        
           

            }
            
            
        });
        
       
    }

    private mapBuyerManufactorerProducts() {
        for (let mi = 0; mi < this.manufacturerProducts.products.length; mi++) {
            for (let bi = 0; bi < this.buyer.products.length; bi++) {
                if (this.manufacturerProducts.products[mi]._id == this.buyer.products[bi].product) {
                    this.manufacturerProducts.products[mi].isChecked = true;
                }
            }
        }
    }

    SearchByCompnay(event:any){
        debugger;
        console.log(this.buyer.products);
        this.loading = true;
        this.productService.getProductsByManufacturer(this.selectedManufacturer).subscribe(res => {
            this.loading = false;
            if (!res.isValid) {
                this.toast.error(res.errors[0])
                return;
            }

            this.manufacturerProducts = res.data;
            this.manufacturerProducts.products = this.manufacturerProducts.products.filter(item=> item.status == "Active");
            if(event.target.value != "" && event.target.value != null){
               this.manufacturerProducts.products= this.manufacturerProducts.products.
                filter(item=> {
                    return item.name.toLocaleLowerCase().includes(event.target.value)
                } ); 
            }
           
            this.mapBuyerManufactorerProducts();
            console.log(this.buyer.products)
        },
        error => {
            this.loading = false;

            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
        });
       
        // if(event.target.value != "" && event.target.value != null){
        //    // this.manufacturerList = JSON.parse(JSON.stringify(this.manufacturerProductListBackUp));
        //    let resutData =this.manufacturerProductListBackUp.products.
        //    filter(item=> {
        //        return item.name.toLocaleLowerCase().includes(event.target.value)
        //    } ); 
        //    JSON.stringify(resutData)
        //    // this.manufacturerProducts.products = 
        // }
        // else{
        //     this.GetProductsByManufacturer();
        // }

    }
    //#endregion

    //#region Error handler
    private checkUnauthorized(handledError: HandledErrorResponse): void {
        this.toast.error(handledError.message);

        if (handledError.code == 401) {
            AuthService.logout();
            this.router.navigate(['/login']);
        }
    }
    //#endregion
}
