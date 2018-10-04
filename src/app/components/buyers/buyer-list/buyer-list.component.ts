import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../../services/buyers/buyer.service';
import { BuyersAggregateResponse } from "../../../models/buyers/BuyersAggregateResponse";
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BuyerResponseModel } from '../../../models/buyers/buyerResponseModel';
import { CompanyBasicDetails } from '../../../models/CompanyBasicDetails';
import { RejectRequest } from '../../../models/shared/rejectRequest';
import { HandledErrorResponse } from '../../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../../shared/helper/service-helper';
import { Utils } from '../../../shared/helper/utils';
import { City } from '../../../models/City';
import { AddressLocation } from '../../../models/addressLocation';
import { State } from '../../../models/States';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { PermissionHelper } from '../../../shared/helper/permission-helper';
//import {OrderByPipe} from "./../../../shared/helper/pipe"

@Component({
  selector: 'app-buyer-list',
  templateUrl: './buyer-list.component.html',
  styleUrls: ['./buyer-list.component.css']
})
export class BuyerListComponent implements OnInit {
  public loading = false;
  public buyersAggregateResponse : BuyersAggregateResponse;
  public displayBuyerList: CompanyBasicDetails[];

  // RejectModal Data;
  public buyerIdToReject : string;
  public rejectReason : string;

  public selectedStatus: string;
  public selectedState: State;
  public selectedCity: City;
  public selectedLocation: AddressLocation;
  public displayCityList: City[];
  public displayLocationList: AddressLocation[];
  public nullVar: string;
  public searchCompany : string;

	public canEdit: boolean;

  public constructor(
    private buyerService: BuyerService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit() {
		this.canEdit = PermissionHelper.canAddEditBuyer();
    this.selectedStatus = this.activatedRoute.snapshot.queryParams['status'] || null;
    this.loadData();
  }

  public loadData(): void {
    this.loading = true;
    this.buyerService.getAllBuyers()
      .subscribe(
        data => {
          this.loading = false;
          let response: BuyersAggregateResponse  = { ...data };
          if (!response.isValid) {
            this.toastService.error(response.errors[0]);
            return;
          }

          this.buyersAggregateResponse = response;
          this.displayBuyerList = this.buyersAggregateResponse.data.buyers;
          if (this.selectedStatus) {
            this.updateDisplayBuyerList();
          }
        },
        error => {
          this.loading = false;
          
          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
          this.checkUnauthorized(handledError);
        }
      );
  }

  //#region Onclick Handlers
  public onNewBuyerButtonClick() : void {
    this.router.navigate(['buyers-registration'])
  }

  public onRejectChildButtonClick(event) : void {
    console.log(event);
    this.buyerIdToReject = event;
  }

  public onRejectButtonClick() : void {
    console.log(this.buyerIdToReject + " is rejected!");
    this.rejectBuyer();
  }

  private rejectBuyer(): void {
    if (!this.rejectReason) {
      this.toastService.error("Please enter reject reason");
      return;
    }

    this.loading = true;
    this.buyerService.rejectBuyer(new RejectRequest(this.buyerIdToReject, this.rejectReason))
      .subscribe(
        data => {
          this.loading = false;
          this.rejectReason = null;

          let response : BuyerResponseModel = { ...data };    
          if (!response.isValid) {
            this.toastService.error(response.errors[0]);
            return;
          }
            
          let buyer: CompanyBasicDetails = response.data;
          this.toastService.success(`Buyer ${buyer.companyName} is rejected!`);
          this.updateBuyerInList(buyer);
        },
        error => {
          this.loading = false;
          this.rejectReason = null;
          
          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
          this.checkUnauthorized(handledError);
        }
      );
  }

  private updateBuyerInList(buyer: CompanyBasicDetails) {
    for (let i = 0; i < this.buyersAggregateResponse.data.buyers.length; i++) {
      if (this.buyersAggregateResponse.data.buyers[i]._id == buyer._id) {
        this.buyersAggregateResponse.data.buyers[i] = buyer;
        break;
      }
    }
  }

  //#endregion

  //#region Change listener

  public changeStatus(event) : void {
    this.selectedStatus = event;
    this.updateDisplayBuyerList();
  }

  public changeState(event) : void {
    console.log(event);

    // Get selected state
    let stateIndex = Utils.getElementIndexByFeild(this.buyersAggregateResponse.data.states, '_id', event);
    if (stateIndex >= 0) {
      this.selectedState = this.buyersAggregateResponse.data.states[stateIndex];
      this.displayCityList = this.selectedState.cities
      this.displayLocationList = null;
    } else{
      this.selectedState = null;
      this.displayCityList = null;
      this.displayLocationList = null;
    }

    // Reset child address selection
    this.selectedCity = null;
    this.selectedLocation = null;
    this.updateDisplayBuyerList();
  }

  public changeCity(event) : void {
    console.log(event);

    // Get selected city
    let index = Utils.getElementIndexByFeild(this.selectedState.cities, '_id', event);
    if (index >= 0) {
      this.selectedCity = this.selectedState.cities[index];
      this.displayLocationList = this.selectedCity.locations;
    } else {
      this.selectedCity = null;
      this.displayLocationList = null;
    }

    // Reset child address selection
    this.selectedLocation = null;
    this.updateDisplayBuyerList();
  }

  public changeLocation(event) : void {
    console.log(event);

    // Get selected city
    let index = Utils.getElementIndexByFeild(this.selectedCity.locations, '_id', event);
    if (index >= 0) {
      this.selectedLocation = this.selectedCity.locations[index];
    } else {
      this.selectedLocation = null;
    }

    // unset location
    this.updateDisplayBuyerList();
  }

  public searchByCompanyName(searchTerm: string) : void {
    if (searchTerm.length < 3) {
      this.updateDisplayBuyerList();
      return;
    }

    let filteredBuyers : CompanyBasicDetails[] = [];
    if(searchTerm.length > 0){
      this.displayBuyerList.filter((item)=>{
        if(item.companyName.toLowerCase().includes(searchTerm.toLowerCase().trim())){
          filteredBuyers.push(item);
        }
      });

      this.displayBuyerList = filteredBuyers;
    }
  }
  //#endregion

  //#region Filters

  private updateDisplayBuyerList() {
    this.displayBuyerList = this.buyersAggregateResponse.data.buyers;

    // Filter for status
    if (this.selectedStatus && !this.selectedStatus.includes("undefined")) {
      this.displayBuyerList = Utils.filter(this.displayBuyerList, "status", this.selectedStatus, false);
    }

    if (this.selectedState) {
      this.displayBuyerList = this.filterForAddress(this.displayBuyerList);
    }
  }

  private filterForAddress(list: CompanyBasicDetails[]) : CompanyBasicDetails[] {
    let temp : CompanyBasicDetails[] = [];
    // Filter for state
    this.displayBuyerList.filter( buyer => {
      if (buyer.invoiceAddress && buyer.invoiceAddress.address.state == this.selectedState._id) {
        temp.push(buyer)
      }
    });

    // Filter for city
    if (this.selectedCity) {
      this.displayBuyerList = temp;
      temp = [];

      this.displayBuyerList.filter( buyer => {
        if (buyer.invoiceAddress && buyer.invoiceAddress.address.city == this.selectedCity._id) {
          temp.push(buyer);
        }
      });
    }

    // Filter for location
    if (this.selectedLocation) {
      this.displayBuyerList = temp;
      temp = [];

      this.displayBuyerList.filter( buyer => {
        if (buyer.invoiceAddress && buyer.invoiceAddress.address.location == this.selectedLocation._id) {
          temp.push(buyer);
        }
      });
    }

    return temp;
  }
  //#endregion

  //#region Error handler
  private checkUnauthorized(handledError: HandledErrorResponse) : void {
    this.toastService.error(handledError.message);

    if (handledError.code == 401) {
      AuthService.logout();
      this.router.navigate(['/login']);
    }
  }
  //#endregion

  //Clear Filter
  public ClearFilter(){
		this.selectedStatus = undefined;
		this.selectedState = undefined;
		this.selectedCity = undefined;
    this.selectedLocation = undefined;
		this.displayCityList =   null;
		this.displayLocationList = null;
    this.searchCompany = "";
		this.displayBuyerList = this.buyersAggregateResponse.data.buyers;
	}
}
