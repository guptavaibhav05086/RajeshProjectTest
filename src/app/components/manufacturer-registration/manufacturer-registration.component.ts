import { Component, OnInit,Input,ViewChild,AfterViewInit,ViewChildren,QueryList,ElementRef, SimpleChanges  } from '@angular/core';
import { CompanyBasicDetails} from './../../models/CompanyBasicDetails'
import {Proprietor} from './../../models/Proprietor'
import { DeliveryAddress} from './../../models/DeliveryAddress'
import { InvoiceAddress} from './../../models/InvoiceAddress'
import { State } from './../../models/States'
import { BankInformation } from './../../models/BankInformation'
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { MSupplyCommonDataService } from '../../services/m-supply-common-data.service';
import { MsupplyFormRegistrationService } from '../../services/msupply-form-registration.service'
import { OtherInformation } from '../../models/OtherInformation';
import { TermsOfTrade } from '../../models/TermsOfTrade';
import { CurrentProductDetail } from '../../models/CurrentProductDetail';
import { DocumentsAndAttachments } from '../../models/DocumentsAndAttachments';
//import { AwsuploadService } from '../../services/awsupload.service'
import { Address } from '../../models/Address';
import { ContactPerson } from '../../models/ContactPerson';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker';
import { City } from '../../models/City';
import { ActivatedRoute } from '@angular/router';
import { ProductsData, Product } from './../../models/Product'
import { ProductCategory } from './../../models/ProductCategory'
import { ProductSubCategory } from './../../models/ProductSubCategory'
import { ProductType } from './../../models/ProductType'
import { Brand } from './../../models/Brand'
import { ProductDimension } from './../../models/ProductDimensions'
import { ToastService } from '../../shared/services/toast/toast.service';
import { ProductserviceService } from '../../services/productservice.service';
import { AddEditProductModalComponent } from './../add-edit-product-modal/add-edit-product-modal.component'
import { Router } from '@angular/router';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { ManufacturerModel } from '../../models/manufacturers/manufacturerModel';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { SalesPerson } from '../../models/salesPerson';
@Component({
  selector: 'app-manufacturer-registration',
  templateUrl: './manufacturer-registration.component.html',
  styleUrls: ['./manufacturer-registration.component.css']
})
export class ManufacturerRegistrationComponent implements OnInit {

    @Input() 
    loadCompanyDetails:CompanyBasicDetails;
    
    @ViewChild('cheque')
    chequeUploded: any;
    @ViewChild('chequeName',{ read: ElementRef })
chequeName: any;
    @ViewChildren('uploadDoc',{ read: ElementRef }) docList: QueryList<ElementRef>;
    @ViewChildren('uploadDocNames',{ read: ElementRef }) docNames: QueryList<ElementRef>;
    @ViewChild('buyerForm') 
    registrationForm: HTMLFormElement;
    newCompanyDetails:CompanyBasicDetails;
    proprietorList:Array<Proprietor>;
    deliveryAddressList:Array<DeliveryAddress>;
    docAttach:Array<DocumentsAndAttachments>;
    invoiceAddress: InvoiceAddress;
    bankInfo:BankInformation;
    otherInfo:OtherInformation;
    curProdDetails:Array<CurrentProductDetail>;
    termOfTrade:TermsOfTrade;
    trackControls:number;
    selectedCities:Array<string>;
    statesCities:Array<State>;
    flagFormValid:boolean;
    userId:string;
    gstinPattern="^([0][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$";
    panPattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}";
    noDecimal="^[0-9]*$";
    decimalUptoTwo="^[0-9]*.?([0-9]{0,2})";
    minDateForDatePicker={
    year:1900,
    month:1,
    date:1
    };
    public validateOnce:boolean = true;
    public ShowManufacturerProductsPanel : boolean = false;
    public ProductData : ProductsData;
    maxDate:any;
    public isEditForm = false;
    public loading =false;
    public manufacturer : ManufacturerModel;
    public showNextProductButton : boolean;
    public downloadDisplay:boolean;
      constructor(private _msupplyService:MSupplyCommonDataService,
        private _msupplyFormService:MsupplyFormRegistrationService,
        private route : ActivatedRoute,
        private productService: ProductserviceService,private toast:ToastService,private router:Router,
        private  modalService: NgbModal) {
        this.userId= this.route.snapshot.queryParams['id'] || null;
        //this.userId="5b386b5cfbdb62057b580b83";
        //this.buyerId="";
        this.newCompanyDetails = new CompanyBasicDetails();
        this.proprietorList=new Array<Proprietor>();
        this.deliveryAddressList=new Array<DeliveryAddress>();
        this.curProdDetails=new Array<CurrentProductDetail>();
        this.docAttach = new Array<DocumentsAndAttachments>();
        this.otherInfo=new OtherInformation();
        this.termOfTrade=new TermsOfTrade();
        this.bankInfo=new BankInformation();
        this.curProdDetails=new Array<CurrentProductDetail>();
        this.statesCities= new Array<State>();
        this.maxDate=this.getMaxDateOfBirth();
       this.downloadDisplay = false;
        
        
      }
    
    
      ngOnInit() {
        this.ProductData = new ProductsData();
        this.ProductData.products = new Array<Product>();
        this.ProductData.categories = new Array<ProductCategory>();
        this.ProductData.subCategories = new Array<ProductSubCategory>();
        this.ProductData.productTypes = new Array<ProductType>();
        this.ProductData.brands = new Array<Brand>();
        
            //debugger;
          if(this.userId == null || this.userId == ""){
              this.showNextProductButton = false;
            this.loadNewForm();
            this.downloadDisplay = false;
            this.ShowManufacturerProductsPanel = true;
              this._msupplyFormService.getStatesAndCities().subscribe(itemStates=> {
                //debugger;
                 this.statesCities=itemStates.data;
                 console.log(itemStates.data);
                 this.invoiceAddress.states=this.statesCities;
                 this.deliveryAddressList[0].states=this.statesCities;
                 this.proprietorList[0].states=this.statesCities;
                 
    
                
           },
           error => {
            this.loading = false;

            let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
            this.checkUnauthorized(handledError);
        }
        );
    
          }
          else{
            //let reqData = new CompanyBasicDetails();
            debugger;
            this.showNextProductButton = true;
            this.loading = true;
            this.downloadDisplay =true;
             this._msupplyFormService.getManufacturerRegistrationForm(this.userId).subscribe(companyDetails=> {
                debugger;
                 try {
                    this.statesCities=companyDetails.data.states;
                    let reqData=  companyDetails.data.manufacturers[0];
                    
                    this.loadEditFormData(reqData);
                    this.manufacturer = reqData;
                    this.loading = false;
                 } catch (error) {
                     console.log(error);
                     this.loading = false;
                     this.toast.error("Error in loading manufacturer Details");
                    this.loadEditFormData(null);
                    // this.router.navigate(['/manufacturers-registration']);
                 }
                 this.ShowManufacturerProductsPanel = true;
               
             //this.newCompanyDetails=data[0];
             },
             error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            });
          }
        
          
          
          
      }
      ngAfterViewInit(){
          for(let i=0;i < this.docAttach.length;i++){
              let itemDoc = this.docAttach[i];
             
            if(this.docNames !=undefined){
                let arraySplit = itemDoc.fileUrl.split('/');
                this.docNames.toArray()[itemDoc.DocId -1 ].nativeElement.value = arraySplit[arraySplit.length-1];
    
            }

          }
          
          
          

          // var propDobId = "pDOB" + proprietor.ProprietorID;
            // this.registrationForm.form.controls[propDobId].setErrors({'incorrect': false});
            // this.registrationForm.form.controls[propDobId].status = "VALID"
        
          debugger;
        console.log(this.docNames.toArray());
          //this.docNames
        // this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
        // this.registrationForm.form.controls['chequeUpload'].status = "VALID";

      }
      ngAfterViewChecked() {
          //debugger;
          if(this.isEditForm && this.validateOnce){
            this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
            this.registrationForm.form.controls['chequeUpload'].status = "VALID";
            for(let j =0 ;j < this.proprietorList.length;j++ ){
                let proprietor = this.proprietorList[j];
                var propDobId = "pDOB" + (proprietor.ProprietorID -1);
                this.registrationForm.form.controls[propDobId].setErrors({'incorrect': false});
                this.registrationForm.form.controls[propDobId].status = "VALID";
    
              }
            this.validateOnce =false;
          }
          else if(this.validateOnce){
            for(let j =0 ;j < this.proprietorList.length;j++ ){
                let proprietor = this.proprietorList[j];
                var propDobId = "pDOB" + (proprietor.ProprietorID -1);
                this.registrationForm.form.controls[propDobId].setErrors({'incorrect': false});
                this.registrationForm.form.controls[propDobId].status = "VALID";
    
              }
              this.validateOnce =false;
          }
          
        console.log(this.docNames.toArray());
        // this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
        // this.registrationForm.form.controls['chequeUpload'].status = "VALID";
        //this.registrationForm.form.controls['pemail0'].setErrors(null);
      }
      ngOnChanges(changes: SimpleChanges){

        // if(this.isEditForm){
        //   this.registrationForm.form.controls['chequeUpload'].setErrors({'incorrect': false});
        //   this.registrationForm.form.controls['chequeUpload'].status = "VALID";
        // }
       
    }
      setValidationImageLoad(elemId:string,url:string){
        if(url !="" && url != null){
          this.registrationForm.form.controls[elemId].setErrors(null);
  
        }
     
    }

    getSalesPerson(){
        debugger;
        this._msupplyFormService.getSalesPersonData().subscribe(res=> {
            if(res["data"] !=undefined && res["errors"] == null){
                this.newCompanyDetails.otherInformation.salesPersonList = res.data;

                console.log(" Seller List: " +  res.data);
            }
            else{
                console.log(res["errors"]);
            }
            
            //this

        });
    }
    /**
     * Comment for method loadEditForm.
     * @param Void  Need to be deleted.
     * @returns       Comment for return value.
     */
      loadEditFormData(reqData:CompanyBasicDetails){
          //debugger;
          this.isEditForm = true;
          try {
            this.proprietorList=new Array<Proprietor>();
            //this.deliveryAddressList=new Array<DeliveryAddress>();
            //this.curProdDetails=new Array<CurrentProductDetail>();
            this.docAttach = new Array<DocumentsAndAttachments>();
            this.otherInfo=new OtherInformation();
            //this.termOfTrade=new TermsOfTrade();
            this.bankInfo=new BankInformation();
            //this.curProdDetails=new Array<CurrentProductDetail>();
            if(reqData!=null){
                //debugger;
                this.initiateCompanyDetails(reqData);
                this.initiateBankDetails(reqData.bankInformation);
                this.initiateInvoiceDetails(reqData.invoiceAddress);
                this.initiateOtherInfo(reqData.otherInformation);
                //data not coming from api currently
                //this.addCurrentProducts();
                //this.termOfTrade=reqData.termsOfTrade;
               
              if(reqData.proprietors !=null && reqData.proprietors.length>0){
                  for(let i=0;i<reqData.proprietors.length;i++){
                      this.addNewPropriterSection(reqData.proprietors[i]); 
                  }
        
                }
                else{
                     this.addNewPropriterSection(null); 
              }
              if(reqData.documentsAndAttachments !=null && reqData.documentsAndAttachments.length>0){
                  for(let i=0;i<reqData.documentsAndAttachments.length;i++){
                      this.addDocumentAttachment(reqData.documentsAndAttachments[i]); 
                  }
        
                }
                else{
                     this.addDocumentAttachment(null); 
              }
        
            }
          } catch (error) {
              this.toast.error('Error in loading the form');
              //this.loadEditFormData(null);
          }
        
    
    
      }
    
      /**
     * Comment for method loadEditForm.
     * @param Void  Need to be deleted.
     * @returns       Comment for return value.
     */
    loadNewForm(){
       
        this.initiateCompanyDetails(null); 
        this.addNewPropriterSection(null); 
        this.addNewDeliverySection(null); 
        this.initiateInvoiceDetails(null);
        this.initiateBankDetails(null);
        this.initiateOtherInfo(null);
        this.addDocumentAttachment(null);
        this.addCurrentProducts();
    }
      /**
     * Comment for method loadEditForm.
     * @param Void  Need to be deleted.
     * @returns       Comment for return value.
     */
    formatFormJsonData(){
        this.proprietorList.forEach(element => {
            if(element.dobDatePicker !=null && element.dobDatePicker !=undefined){
                element.dateOfBirth = this.getDateFormProp(element.dobDatePicker);
            }
            });
            // if(this.newCompanyDetails._id == undefined || this.newCompanyDetails._id == null){
            //     this.newCompanyDetails._id=this.userId;
            // }
            
    this.otherInfo.salesPersonList = this.newCompanyDetails.otherInformation.salesPersonList;
    this.newCompanyDetails.bankInformation=this.bankInfo;
    this.newCompanyDetails.businessType="Retailer";
    this.newCompanyDetails.deliveryAddresses=this.deliveryAddressList;
    this.newCompanyDetails.proprietors=this.proprietorList;
    this.newCompanyDetails.invoiceAddress=this.invoiceAddress;
    this.newCompanyDetails.otherInformation=this.otherInfo;
    this.newCompanyDetails.termsOfTrade=this.termOfTrade;
    this.newCompanyDetails.documentsAndAttachments=this.docAttach;
    this.newCompanyDetails.otherInformation.currentProducts=this.curProdDetails;
    console.log(JSON.stringify(this.newCompanyDetails));
    //this.newCompanyDetails.
    }
    getDateFormProp(dobPicker){
        var date = new Date(dobPicker.year,(dobPicker.month-1),dobPicker.day);
    //var date = dobPicker.day + " " + dobPicker.month + " " + dobPicker.year;
    return date;
    }
    SaveDetails(){
    debugger;
        this.formatFormJsonData();
        if(this.userId == null || this.userId == ""){
            console.log("Inside Create")
            console.log("User Id: " + this.userId);
            //alert('Details saved successfully');
            this.loading =true;
            this._msupplyFormService.createManufacturerForm(this.newCompanyDetails).subscribe(res=>{
                this.loading =false;
                if(res["errors"] != null){
                    let errMsg:string = res["errors"][0];
                    this.toast.error(res["errors"][0]);
                    // if(errMsg !=null && errMsg !=undefined){
                    //     if(errMsg.includes('gstIn_1 dup key')){
                    //         this.toast.error('Duplicate GSTIN pin');
                    //     }
                    //     else if(errMsg.includes('panNumber_1 dup key')){
                    //         this.toast.error('Duplicate PAN Number');
                    //     }
                    //     else if(errMsg.includes('emailId_1 dup key')){
                    //         this.toast.error('Duplicate Email Number');
                    //     }
                    //     else if(errMsg.includes('mobileNumber_1 dup key')){
                    //         this.toast.error('Duplicate Mobile Number');

                    //     }
                    //     else{
                    //         this.toast.error('Error occured in server.Please contact Admin');
                    //     }

                    // }
                    
                    //this.toast.error('res["errors"][0]');
                }
                else {
                    this.manufacturer = res.data;
                    this.userId = res.data._id;
                    console.log(this.userId);
                    this.toast.success('Details saved successfully');
                    this.ShowManufacturerProducts();

                }
                
                console.log(res);
            },
                
                
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            }
        );
    
        }
        else{
            this._msupplyFormService.updateManufacturerForm(this.newCompanyDetails).subscribe(result=> {

                if(result["errors"] != null){
                    this.toast.error(result["errors"][0]);
                }
                else {
                    this.toast.success('Details saved successfully');
                    this.ShowManufacturerProducts();


                }
                
                console.log(result);
            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            });
        }
        
    }
    
       /**
     * Comment for method loadEditForm.
     * @param Void  Need to be deleted.
     * @returns       Comment for return value.
     */
    initiateOtherInfo(_otherInfo:OtherInformation){
        debugger;
    if(_otherInfo!=null){
    this.otherInfo.billingSoftware=_otherInfo.billingSoftware;
    this.otherInfo.turnOver=_otherInfo.turnOver;
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
    initiateBankDetails(_bankInformation:BankInformation){
        
        this.bankInfo.ACType=this._msupplyService.getAccountType();
        this.bankInfo.isChecqueSizeValid=true;
        this.bankInfo.isChecqueValid=true;
        this.bankInfo.isReenterValid=true;
        this.bankInfo.accountType = null;
        if(_bankInformation!=null){
            this.bankInfo._id=_bankInformation._id;
            this.bankInfo.accountHolderName=_bankInformation.accountHolderName;
            this.bankInfo.accountNumber=_bankInformation.accountNumber;
            this.bankInfo.chequeImageUrl=_bankInformation.chequeImageUrl;
            this.bankInfo.ifscCode=_bankInformation.ifscCode;
            this.bankInfo.ReEnterAccountNumber=_bankInformation.accountNumber;
            this.bankInfo.accountType=_bankInformation.accountType;
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
    initiateInvoiceDetails(_invoceDetails:InvoiceAddress){
        debugger;
        try {
            this.invoiceAddress= new InvoiceAddress();
        let address = new Address();
        let contactPerson=new ContactPerson();
        this.invoiceAddress.address=address;
        this.invoiceAddress.contactPerson=contactPerson;
        this.invoiceAddress.isPinValid=true;
        this.invoiceAddress.selectedCities = new Array<City>();
        //this.invoiceAddress.se
        // let listStates = new State();
        // listStates.state="Uttar Pradesh";
        // listStates.cities=['Farrukhabad','Lucknow','Kanpur','Banares'];
         this.invoiceAddress.states=new Array<State>();
         this.invoiceAddress.states=this.statesCities;
        // this.invoiceAddress.states.push(listStates);
        //debugger;
        this.invoiceAddress.isMobileValid=true;
        this.invoiceAddress.isEmailValid=true;
        this.invoiceAddress.address.state=null;
        this.invoiceAddress.address.city=null;
        if(_invoceDetails!=null){
           
            if(_invoceDetails.address !=null && _invoceDetails.address!=undefined){
                this.invoiceAddress.address=_invoceDetails.address;
                //this.invoiceAddress.address.state=this.invoiceAddress.address.stateId;
                //this.invoiceAddress.address.city=this.invoiceAddress.address.cityId;
    
            }
            if(_invoceDetails.contactPerson !=null && _invoceDetails.contactPerson !=undefined){
                this.invoiceAddress.contactPerson=_invoceDetails.contactPerson;
            }
            this.invoiceAddress.selectedState=this.statesCities.filter(item=> item._id == this.invoiceAddress.address.state)[0];
            if(this.invoiceAddress.selectedState !=null){
                this.invoiceAddress.selectedCities=this.invoiceAddress.selectedState.cities;
                this.invoiceAddress.selectedCity=this.invoiceAddress.selectedCities.filter(city=> city._id == this.invoiceAddress.address.city)[0];
            if(this.invoiceAddress.selectedCity ==null){
                this.invoiceAddress.selectedCity=new City();
                this.invoiceAddress.selectedCity.name=null;
    
            }
    
        }
            
    
    
        }
        } catch (error) {
            this.toast.error('Error in loading the manufacturer details');
        }
        
    }
    
      
    
      /**
     * Comment for method loadEditForm.
     * @param Void  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    addDocumentAttachment(_docAttach:DocumentsAndAttachments){
        let itemDoc=new DocumentsAndAttachments();
        if(this.docAttach.length>0){
            itemDoc.DocId = (this.docAttach[this.docAttach.length-1].DocId + 1);
        }
        else{
            itemDoc.DocId=1;
        }   
        itemDoc.isDocSizeValid=true;
        itemDoc.isDocValid=true;
        
        if(_docAttach!=null){
            itemDoc.documentName=_docAttach.documentName;
            itemDoc.fileName=_docAttach.fileName;
            itemDoc.fileUrl=_docAttach.fileUrl;
            if(itemDoc.fileUrl !=null && itemDoc.fileUrl !=""){
                let arraySplit = itemDoc.fileUrl.split('/');
                //this.chequeName.nativeElement.value = arraySplit[arraySplit.length-1];
                if(this.docNames !=undefined){
                    this.docNames.toArray()[itemDoc.DocId -1 ].nativeElement.value = arraySplit[arraySplit.length-1];

                }
                

               // element.pricingSheetName = arraySplit[arraySplit.length-1]; 
              }
    
        }
        this.docAttach.push(itemDoc);
    
    }
    
     /**
     * Comment for method loadEditForm.
     * @param Void  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    deleteDocumentAttachment(docId:number){
        this.docAttach=this.docAttach.filter(item=> item.DocId != docId);
        }
       /**
     * Comment for method loadEditForm.
     * @param Void  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    addCurrentProducts(){
    let curProd=new CurrentProductDetail();
    if(this.curProdDetails.length>0){
        curProd.ProductId = (this.curProdDetails[this.curProdDetails.length-1].ProductId + 1);
    }
    else{
        curProd.ProductId=1;
    }   
    this.curProdDetails.push(curProd);
    }
     /**
     * Comment for method loadEditForm.
     * @param Void  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    deleteCurrentProducts(prodId:number){
        this.curProdDetails=this.curProdDetails.filter(item=> item.ProductId != prodId);
        }
    
    
      /**
     * Comment for method loadEditForm.
     * @param Void  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
      loadEditForm(){
    
      }
    
      /**
     * Comment for method validateBankInfo.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    validateBankInfo(elemId:any){
    this.bankInfo.validateBankInfo();
    // if(this.bankInfo.isReenterValid){
    //     this.registrationForm.form.controls[elemId].setErrors({'incorrect': true});
    // }
    // else{
    //     this.registrationForm.form.controls[elemId].setErrors({'incorrect': false});
    // }
    }
      
      /**
     * Comment for method mobileNumberValidation.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
      mobileNumberValidation(type:string){
          this.newCompanyDetails.Validations(type);
      }
    
       /**
     * Comment for method initiateCompanyDetails.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    initiateCompanyDetails(_companyDetails:CompanyBasicDetails){
        this.newCompanyDetails = new CompanyBasicDetails();
        this.newCompanyDetails.EstablishedYear=new Array<string>();
        this.newCompanyDetails.established=null;
        this.newCompanyDetails.BusinessTypes=this._msupplyService.getBusinessType();
        this.newCompanyDetails.businessType ="Retailer";
        this.newCompanyDetails.businessType=null;
        this.newCompanyDetails.LegalStatuses=this._msupplyService.getLegalStatuses();
        this.newCompanyDetails.EstablishedYear=this._msupplyService.getEstablishedYearDropDown();
        this.newCompanyDetails.legalStatus=null;
        this.newCompanyDetails.loanAssistanceRequired=false;
        this.newCompanyDetails.isMobileValid=true;
        this.newCompanyDetails.isLandlineVaid=true;
        this.newCompanyDetails.isLogoImageSizeValid=true;
        this.newCompanyDetails.isLogoImageValid=true;
        this.newCompanyDetails.isPhoto1ImageSizeValid=true;
        this.newCompanyDetails.isPhoto1ImageValid=true;
        this.newCompanyDetails.isPhoto2ImageValid=true;
        this.newCompanyDetails.isPhoto2ImageSizeValid=true;
        //this.newCompanyDetails.seqCode=0;
        // this.newCompanyDetails.seqCode=0;
        if(_companyDetails !=null){
            this.newCompanyDetails._id=_companyDetails._id;
            this.newCompanyDetails.allowmSupplyToCallOrSMS=_companyDetails.allowmSupplyToCallOrSMS;
            this.newCompanyDetails.businessType=_companyDetails.businessType;
            this.newCompanyDetails.cinNumber=_companyDetails.cinNumber;
            this.newCompanyDetails.companyName=_companyDetails.companyName;
            this.newCompanyDetails.createdAt=_companyDetails.createdAt;
            this.newCompanyDetails.emailId=_companyDetails.emailId;
            this.newCompanyDetails.gstIn=_companyDetails.gstIn;
            this.newCompanyDetails.landLineNumber=_companyDetails.landLineNumber;
            this.newCompanyDetails.legalStatus=_companyDetails.legalStatus;
            this.newCompanyDetails.loanAmount=_companyDetails.loanAmount;
            this.newCompanyDetails.loanAssistanceRequired=_companyDetails.loanAssistanceRequired;
            this.newCompanyDetails.logoUrl=_companyDetails.logoUrl;
            this.newCompanyDetails.mobileNumber=_companyDetails.mobileNumber;
            this.newCompanyDetails.panNumber=_companyDetails.panNumber;
            this.newCompanyDetails.photo1Url=_companyDetails.photo1Url;
            this.newCompanyDetails.photo2Url=_companyDetails.photo2Url;
            this.newCompanyDetails.established=_companyDetails.established;
            this.newCompanyDetails.websiteUrl=_companyDetails.websiteUrl;
            this.newCompanyDetails.password=_companyDetails.password;
            this.newCompanyDetails.seqCode = _companyDetails.seqCode;
            this.setValidationImageLoad('logoUpload',this.newCompanyDetails.photo1Url);
        this.setValidationImageLoad('imageUpload',this.newCompanyDetails.photo1Url);
        this.setValidationImageLoad('imageUpload2',this.newCompanyDetails.photo2Url);
    
    
    
        }
    }
    
      /**
     * Comment for method addNewPropriterSection.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
      addNewPropriterSection(_proprietor : Proprietor){
          //debugger;
        //let proprietor=null;
        let  proprietor=new Proprietor();
         let newAdd = new Address();
         proprietor.address=newAdd; 
            if(this.proprietorList.length>0){
                proprietor.ProprietorID = (this.proprietorList[this.proprietorList.length-1].ProprietorID + 1);
            }
            else{
                proprietor.ProprietorID=1;
            }   
        proprietor.IsStateValid=true;
        proprietor.isCityValid=true;
        proprietor.isPinValid=true;
        proprietor.selectedState=new State();
        proprietor.selectedCities=new Array<City>();
        proprietor.selectedCity=new City();
        proprietor.isMobileValid=true;
        proprietor.isEmailValid = true;
        proprietor.isDOBValid=true;
        // let listStates = new State();
        // listStates.state="Uttar Pradesh";
        // listStates.cities=['Farrukhabad','Lucknow','Kanpur','Banares'];
        proprietor.states=new Array<State>();
        //proprietor.states=this.statesCities
        proprietor.states=this.statesCities;
        proprietor.address.city=null;
        proprietor.address.state = null;
        //proprietor.states.push(listStates);
        //debugger;
        if(_proprietor!=null){
            proprietor.address=_proprietor.address;
            //proprietor.address.state=proprietor.address.stateId;
            //proprietor.address.city=proprietor.address.cityId;
            proprietor._id=_proprietor._id;
            proprietor.name=_proprietor.name;
            proprietor.selectedState=this.statesCities.filter(item=> item._id == _proprietor.address.state)[0];
            if(proprietor.selectedState !=null){
            proprietor.selectedCities=proprietor.selectedState.cities;
            proprietor.selectedCity=proprietor.selectedCities.filter(city=> city._id == _proprietor.address.city)[0];
            if(proprietor.selectedCity ==null){
                proprietor.selectedCity=new City();
                proprietor.selectedCity.name=null;
    
            }
    
            }
            //debugger;
            //let NgbDateStruct=
            proprietor.dobDatePicker=this._msupplyService.getDateFormatForBSDateControl(_proprietor.dateOfBirth);
           
            // var propDobId = "pDOB" + proprietor.ProprietorID;
            // this.registrationForm.form.controls[propDobId].setErrors({'incorrect': false});
            // this.registrationForm.form.controls[propDobId].status = "VALID"
           
            //this._msupplyService.getDateFormatForBSDateControl(_proprietor.dateOfBirth);
            //proprietor.dateOfBirth=new NgbDateStruct();
           //this._msupplyService.getDateFormatForBSDateControl(_proprietor.dateOfBirth);
            //proprietor.dateOfBirth=_proprietor.dateOfBirth;
            proprietor.emailId=_proprietor.emailId;
            proprietor.mobileNumber=_proprietor.mobileNumber;
            //pro
    
        }
        this.proprietorList.push(proprietor);
        
      }
    
    /**
     * Comment for method addNewDeliverySection.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
      addNewDeliverySection(_deliveryAdd:DeliveryAddress){
        debugger;
        let address=new DeliveryAddress();
        let objAdd=new Address();
        let contactP = new ContactPerson();
        address.address=objAdd;
        address.contactPerson=contactP;
        
        
            if(this.deliveryAddressList.length>0){
                address.DeliveryID=(this.deliveryAddressList[this.deliveryAddressList.length-1].DeliveryID +1);
            }
            else{
                address.DeliveryID=1;
                
            }   
        address.IsStateValid=true;
        address.isCityValid=true;
        address.isPinValid=true;
        address.address.state=null;
        address.selectedCities=new Array<City>();
        address.address.city=null;
        address.isMobileValid=true;
        address.isMobileFilled=true;
        address.isEmailValid=true;
        address.isEmailFilled=true;
        address.isContactPersonValid=true;
        address.isDesignationValid=true;
        address.isAddressLine1Valid=true;
        // let listStates = new State();
        // listStates.state="Uttar Pradesh";
        // listStates.cities=['Farrukhabad','Lucknow','Kanpur','Banares'];
         address.states=new Array<State>();
         address.states=this.statesCities;
        // address.states.push(listStates);
        if(_deliveryAdd !=null){
            address._id=_deliveryAdd._id;
            address.address=_deliveryAdd.address;
            address.contactPerson=_deliveryAdd.contactPerson;
      //address.address.state=address.address.stateId;
           // address.address.city=address.address.cityId;
            address.selectedState=this.statesCities.filter(item=> item._id == address.address.state)[0];
            if(address.selectedState !=null){
                address.selectedCities=address.selectedState.cities;
                address.selectedCity=address.selectedCities.filter(city=> city._id == address.address.city)[0];
            if(address.selectedCity ==null){
                address.selectedCity=new City();
                address.selectedCity.name=null;
    
            }
    
        }
        
        
      }
      this.deliveryAddressList.push(address);
    }
    /**
     * Comment for method addNewDeliverySection.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    removeDeliverySection(delId:number){
        this.deliveryAddressList=this.deliveryAddressList.filter(item=> item.DeliveryID != delId);
    }
    /**
     * Comment for method addNewDeliverySection.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    removeProprietorSection(delId:number){
        this.proprietorList=this.proprietorList.filter(item=> item.ProprietorID != delId);
    }
    /**
     * Comment for validateProprietor.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    validateCompanyBasicDetails(type:string,elemId:any){
       // this.testMethod();//To be deleted
       debugger;
        let result=this.newCompanyDetails.Validations(type);
        if(result == false && type=="email"){
            
        this.registrationForm.form.controls[elemId].setErrors({'incorrect': true});
        }
        else if(result && type=="email"){
           
            this.registrationForm.form.controls[elemId].setErrors(null);
        }
        if(result == false && type=="mobile"){
            
            this.registrationForm.form.controls[elemId].setErrors({'incorrect': true});
            }
            else if(result && type=="mobile"){
               
                this.registrationForm.form.controls[elemId].setErrors(null);
            }
    }
    validateProprietorDOB(event:any,propId:number,type:string,elemId:any){
        let updatedProp = this.proprietorList.find(function (obj) { return obj.ProprietorID === propId; });
        updatedProp.dateOfBirth=event;
    
        let result= updatedProp.ValidateAddress(type);
    
    if(result == false && type=="dob"){
        let tempId='pDOB' + elemId;
    this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
    }
    else if(result && type=="dob"){
        let tempId='pDOB' + elemId;
        this.registrationForm.form.controls[tempId].setErrors(null);
    }
    }
      /**
     * Comment for validateProprietor.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    validateProprietor(propId:number,type:string,elemId:any){
        debugger;
    let updatedProp = this.proprietorList.find(function (obj) { return obj.ProprietorID === propId; })
    let result= updatedProp.ValidateAddress(type);
    
    if(result == false && type=="dob"){
        let tempId='pDOB' + elemId;
    this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
    }
    else if(result && type=="dob"){
        let tempId='pDOB' + elemId;
        this.registrationForm.form.controls[tempId].setErrors(null);
    }
    if(result == false && type=="email"){
        let tempId='pemail' + elemId;
    this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
    }
    else if(result && type=="email"){
        let tempId='pemail' + elemId;
        this.registrationForm.form.controls[tempId].setErrors(null);
    }
    if(result == false && type=="pin"){
        let tempId='proPinCode' + elemId;
    this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
    }
    else if(result && type=="pin"){
        let tempId='proPinCode' + elemId;
        this.registrationForm.form.controls[tempId].setErrors(null);
    }
    if(result == false && type=="mobile"){
        let tempId='pMNumber' + elemId;
    this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
    }
    else if(result && type=="mobile"){
        let tempId='pMNumber' + elemId;
        this.registrationForm.form.controls[tempId].setErrors(null);
    }
    if(type=="state"){
        updatedProp.selectedCities=new Array<City>();
        updatedProp.address.state = updatedProp.states.find(function(obj){return obj._id=== updatedProp.address.state})._id;
        //updatedProp.address.state=updatedProp.address.stateId;
        updatedProp.selectedCities=updatedProp.states.find(function(obj){return obj._id=== updatedProp.address.state}).cities;
        updatedProp.address.cityId=null;
    }
    else if(type=="state"){
        updatedProp.selectedCities=new Array<City>();
    }
    if(type=="city"){
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
    copyInvoiceAddress(deliveryId:number,status:boolean){
    
        let selectedAddress = this.deliveryAddressList.find(function (obj) { return obj.DeliveryID === deliveryId; })
        let allSelectedInvoicesAddress = this.deliveryAddressList.filter(add=> add.useAsInvoice === true);
        for(let i=0;i < allSelectedInvoicesAddress.length;i++ ){
            allSelectedInvoicesAddress[i].useAsInvoice=false;
        }
        if(status){
            selectedAddress.useAsInvoice = status;
            this.invoiceAddress.address=selectedAddress.address;      
            this.invoiceAddress.selectedCities=selectedAddress.selectedCities;       
            this.invoiceAddress.states=selectedAddress.states;
            this.invoiceAddress.contactPerson=selectedAddress.contactPerson;      
        }
        else{
            
            selectedAddress.useAsInvoice = status;
            let address = new Address();
            let contactP = new ContactPerson();
            this.invoiceAddress.address=address;
            this.invoiceAddress.contactPerson=contactP;
            
            this.invoiceAddress.selectedCities=new Array<City>();
           
        }
        this.validateInvoiceAddress('pin','invoicePinCode');
        this.validateInvoiceAddress('mobile','invoiceMNumber');
        this.validateInvoiceAddress('email','invoiceEmail')
        
    }
    
     /**
     * Comment for validateProprietor.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    getMaxDateOfBirth():any{
        let todaysDate= new Date();
       
        let maxDate = {
            year: todaysDate.getFullYear()-18, 
            month: todaysDate.getMonth() +1, 
            day: todaysDate.getDate()
    
    
        }
        return maxDate;
    }
    
     /**
     * Comment for validateProprietor.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    validateInvoiceAddress(type:string,tempId){
       let result= this.invoiceAddress.ValidateInvoiceAddress(type);
        if(result == false && type=="email"){
            //let tempId='pemail' + elemId;
        this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
        }
        else if(result && type=="email"){
            //let tempId='pemail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if(result == false && type=="pin"){
            //let tempId='proPinCode' + elemId;
        this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
        }
        else if(result && type=="pin"){
           // let tempId='proPinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if(result == false && type=="mobile"){
            //let tempId='pMNumber' + elemId;
        this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
        }
        else if(result && type=="mobile"){
            //let tempId='pMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if( type=="state"){
            this.invoiceAddress.selectedCities=new Array<City>();
            let selectedState = this.invoiceAddress.address.state;
            //this.invoiceAddress.address.stateId=this.invoiceAddress.states.find(function(obj){return obj._id===  selectedState})._id;
            //this.invoiceAddress.address.state=this.invoiceAddress.address.stateId;
            this.invoiceAddress.selectedCities= this.invoiceAddress.states.find(function(obj){return obj._id===  selectedState}).cities;
            this.invoiceAddress.address.city=null;
        }
        else if(type=="state"){
            this.invoiceAddress.selectedCities=new Array<City>();
        }
        if(type=="city"){
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
    
     validateDeliveryAdddress(deliveryId:number,type:string,elemId:any){
        let updatedDelAddress = this.deliveryAddressList.find(function (obj) { return obj.DeliveryID === deliveryId; })
        let result= updatedDelAddress.ValidateDeliveryAddress(type);
        if(result == false && type=="email"){
            let tempId='demail' + elemId;
        this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
        }
        else if(result && type=="email"){
            let tempId='demail' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if(result == false && type=="pin"){
            let tempId='pinCode' + elemId;
        this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
        }
        else if(result && type=="pin"){
            let tempId='pinCode' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if(result == false && type=="mobile"){
            let tempId='dMNumber' + elemId;
        this.registrationForm.form.controls[tempId].setErrors({'incorrect': true});
        }
        else if(result && type=="mobile"){
            let tempId='dMNumber' + elemId;
            this.registrationForm.form.controls[tempId].setErrors(null);
        }
        if( type=="state"){
            updatedDelAddress.selectedCities=new Array<City>();
            updatedDelAddress.address.stateId= updatedDelAddress.states.find(function(obj){return obj._id=== updatedDelAddress.address.state})._id;
            updatedDelAddress.selectedCities=updatedDelAddress.states.find(function(obj){return obj._id=== updatedDelAddress.address.state}).cities;
            updatedDelAddress.address.cityId=null;
        }
        else if(type=="state"){
            updatedDelAddress.selectedCities=new Array<City>();
        }
        if(type=="city"){
            //updatedDelAddress.address.city=updatedDelAddress.address.cityId;
            // updatedDelAddress.address.cityId=updatedDelAddress.selectedCities.find(function(obj){
            //     return obj.name === updatedDelAddress.address.city
            // })._id;
        }
     }
      /**
     * Comment for method fileSelect.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
       fileSelect(images: FileList,name:string) {  
           debugger;
            var result = '';
            var file;
            debugger;
            for (var i = 0; file = images[i]; i++) {
                 // if the file is not an image, continue
                if(!this.validateFiles(name,file)){
                    if(!this.newCompanyDetails.isPhoto1ImageValid 
                        || !this.newCompanyDetails.isPhoto2ImageValid 
                        || !this.newCompanyDetails.isLogoImageValid ){
                            this.toast.error('File  should be an Image');
                    //alert("File  should be an Image");
                    }
                    else{
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
                        document.getElementById(name).innerHTML="";
                        document.getElementById(name).appendChild(div);
                    };
                }(file));
                this._msupplyFormService.postMsupplyFiles(file,name).subscribe(data=>{
                    debugger;
                    if(name=="photo1"){
                        this.newCompanyDetails.photo1Url=data.url;
    
                    }
                    else if(name=="photo2"){
                        this.newCompanyDetails.photo2Url=data.url;
    
                    }
                    else if(name=="logoInfo"){
                        this.newCompanyDetails.logoUrl=data.url;
    
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
    uploadMultiplefileSelect(files: FileList,docId:number) {  
        let ext=files[0].name.split('.')[1];
        let file=files[0];
        let id="docUpload" + (docId-1);
        let selectedDocAttach=this.docAttach.filter(item=> item.DocId == docId);
        let item = this.docList;
        this.docNames.toArray()[docId-1].nativeElement.value=file.name;
        if(file.type.match('image.*') || ext=="doc" || ext=="docx" || ext =="pdf"|| ext=="xls" || ext=="xlsx"  ){
            selectedDocAttach[0].isDocValid=true;
            
            this._msupplyFormService.postMsupplyFiles(file,name).subscribe(data=>{
                debugger;           
                selectedDocAttach[0].fileUrl=data.url;
                this.toast.success('File Uploaded Successfully');
    
            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            }
        );
    
        }
        else{
            selectedDocAttach[0].isDocValid=false;
            //this.docList[0].value="";
            //this.registrationForm.form.controls[id].nativeElement.value="";
            //this.registrationForm.con
            this.docList.toArray()[docId-1].nativeElement.value="";
            this.toast.error('Invalid File Format');
            this.docNames.toArray()[docId-1].nativeElement.value="";
            //document.getElementById(id).innerHTML=document.getElementById(id).innerHTML;
            return;
            //files[0]=null;
        }
        if(file.size > 5000000){
            selectedDocAttach[0].isDocSizeValid=false;
            this.docList.toArray()[docId-1].nativeElement.value="";
            this.toast.error('File size exceeds 5 MB');
            this.docNames.toArray()[docId-1].nativeElement.value="";
            //this.chequeUploded.nativeElement.value = "";
            
    
        }
        else{
            selectedDocAttach[0].isDocSizeValid=true;
         
        }
    
    }
    /**
     * Comment for method fileSelect.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    selectCheque(files:File,name:string){
        let ext=files[0].name.split('.')[1];
        let file=files[0];
        this.chequeName.nativeElement.value = file.name;
        if(file.type.match('image.*') || ext=="doc" || ext=="docx" || ext =="pdf"|| ext=="xls" || ext=="xlsx"  ){
          
                this.bankInfo.isChecqueValid=true;
    
            
            
            this._msupplyFormService.postMsupplyFiles(file,name).subscribe(data=>{
                debugger;           
                    this.bankInfo.chequeImageUrl=data.url;
                    this.toast.success('File Uploaded Successfully');
    
            },
            error => {
                this.loading = false;

                let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
                this.checkUnauthorized(handledError);
            }
        );
            
    
        }
        else{
            this.bankInfo.isChecqueValid=false;
            this.chequeUploded.nativeElement.value = "";
            this.toast.error('Invalid File Format');
            this.chequeName.nativeElement.value="";
            return;
            //files[0]=null;
        }
        if(file.size > 5000000){
            this.bankInfo.isChecqueSizeValid=false;
            this.chequeUploded.nativeElement.value = "";
            this.toast.error('File size exceeds 5 MB');
            this.chequeName.nativeElement.value="";
            
    
        }
        else{
            this.bankInfo.isChecqueSizeValid=true;
         
        }
    }
    /**
     * Comment for method fileSelect.
     * @param target  Comment for parameter ´target´.
     * @returns       Comment for return value.
     */
    validateFiles(name:string,file:File):boolean{
        if(name == "photo1"){
            if (!file.type.match('image.*')) {
                    
                this.newCompanyDetails.isPhoto1ImageValid=false;
                return false;
            }
            else{
                this.newCompanyDetails.isPhoto1ImageValid=true;
                
            }
            if(file.size > 5000000){
                this.newCompanyDetails.isPhoto1ImageSizeValid=false;
             
                return false;
    
            }
            else{
                this.newCompanyDetails.isPhoto1ImageSizeValid=true;
             
            }
           
        }
        else if(name =="photo2"){
            if (!file.type.match('image.*')) {
                    
                this.newCompanyDetails.isPhoto2ImageValid=false;
                return false;
            }
            else{
                this.newCompanyDetails.isPhoto2ImageValid=true;
                
            }
            if(file.size > 5000000){
                this.newCompanyDetails.isPhoto2ImageSizeValid=false;
             
                return false;
    
            }
            else{
                this.newCompanyDetails.isPhoto2ImageSizeValid=true;
             
            }
        }
        else if(name =="logoInfo"){
            if (!file.type.match('image.*')) {
                    
                this.newCompanyDetails.isLogoImageValid=false;
                return false;
            }
            else{
                this.newCompanyDetails.isLogoImageValid=true;
                
            }
            if(file.size > 5000000){
                this.newCompanyDetails.isLogoImageSizeValid=false;
             
                return false;
    
            }
            else{
                this.newCompanyDetails.isLogoImageSizeValid=true;
             
            }
            
        }
    
        return true;
    }

    GetValueFromListById(list : Array<any>, id): string
  {
    for(let i=0; i < list.length; i++){
      if(list[i]._id == id){
        return list[i].name;
      }
    }
    return "";
  }

  //Show Manufacturer Products Panel/Form
  ShowManufacturerProducts(){
    this.router.navigate(['manufacturers-products'], { queryParams: { id: this.manufacturer._id }});
    return;
  }

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
