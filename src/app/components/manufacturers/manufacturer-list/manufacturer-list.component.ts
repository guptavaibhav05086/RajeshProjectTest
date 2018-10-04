import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RejectRequest } from '../../../models/shared/rejectRequest';
import { ManufacturerAggregateResponse } from '../../../models/manufacturers/manufacturersAggregateResponse';
import { ManufacturerService } from '../../../services/manufacturers/manufacturer.service';
import { ManufacturerModel } from '../../../models/manufacturers/manufacturerModel';
import { ManufacturerResponseModel } from '../../../models/manufacturers/manufacturerResponseModel';
import { State } from '../../../models/States';
import { City } from '../../../models/City';
import { AddressLocation } from '../../../models/addressLocation';
import { Utils } from '../../../shared/helper/utils';
import { HandledErrorResponse } from '../../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../../shared/helper/service-helper';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { PermissionHelper } from '../../../shared/helper/permission-helper';

@Component({
	selector: 'app-manufacturer-list',
	templateUrl: './manufacturer-list.component.html',
	styleUrls: ['./manufacturer-list.component.css']
})
export class ManufacturerListComponent implements OnInit {
	public loading = false;
	public manufacturersAggregateResponse: ManufacturerAggregateResponse;
	public displayManufacturerList: ManufacturerModel[];
	public errorMessage: any;

	// RejectModal Data.
	public manufacturerIdToReject: string;
	public rejectReason: string;

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
		private manufacturerService: ManufacturerService,
		private toastService: ToastService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) { }

	public ngOnInit() {
		this.canEdit = PermissionHelper.canAddEditManufacturer();
		this.selectedStatus = this.activatedRoute.snapshot.queryParams['status'] || null;
		this.loadData();
	}

	public loadData(): void {
		this.loading = true;
		this.manufacturerService.getAllManufacturers()
			.subscribe(
				data => {
					this.loading = false;

					let response: ManufacturerAggregateResponse = { ...data };
					if (!response.isValid) {
						this.toastService.error(response.errors[0]);
						return;
					}

					this.manufacturersAggregateResponse = response;
					this.displayManufacturerList = this.manufacturersAggregateResponse.data.manufacturers;
					
					if (this.selectedStatus) {
						this.updatedisplayManufacturerList();
					}
				},
				error => {
					this.errorMessage = <any>error;
					this.loading = false;

					let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
					this.checkUnauthorized(handledError);
				}
			);
	}

	//#region Onclick Handlers
	public onNewManufacturerButtonClick(): void {
		this.router.navigate(['manufacturers-registration'])
	}

	public onRejectChildButtonClick(event): void {
		console.log(event);
		this.manufacturerIdToReject = event;
	}

	public onRejectButtonClick(): void {
		console.log(this.manufacturerIdToReject + " is rejected!");
		this.rejectManufacturer();
	}

	private rejectManufacturer(): void {
		if (!this.rejectReason) {
			this.toastService.error("Please enter reject reason");
			return;
		}

		this.loading = true;
		this.manufacturerService.rejectManufacturer(new RejectRequest(this.manufacturerIdToReject, this.rejectReason))
			.subscribe(
				data => {
					this.loading = false;
					this.rejectReason = null;

					let response: ManufacturerResponseModel = { ...data };
					if (!response.isValid) {
						this.toastService.error(response.errors[0]);
						return;
					}

					let manufacturer: ManufacturerModel = response.data;
					this.toastService.success(`Manufacturer ${manufacturer.companyName} is rejected!`);
					this.updateManufacturerInList(manufacturer);

				},
				error => {
					this.loading = false;
					this.rejectReason = null;

					let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
					this.checkUnauthorized(handledError);
				}
			);
			//to close reject modal
			document.getElementById("closeModal").click();
	}

	private updateManufacturerInList(manufacturer: ManufacturerModel) {
		console.log(this.manufacturersAggregateResponse.data.manufacturers);
		for (let i = 0; i < this.manufacturersAggregateResponse.data.manufacturers.length; i++) {
			if (this.manufacturersAggregateResponse.data.manufacturers[i]._id == manufacturer._id) {
				this.manufacturersAggregateResponse.data.manufacturers[i] = manufacturer;
				break;
			}
		}
	}
	//#endregion

	//#region Change listener

	public changeStatus(event): void {
		this.selectedStatus = event;
		this.updatedisplayManufacturerList();
	}

	public changeState(event): void {
		console.log(event);

		// Get selected state
		let stateIndex = Utils.getElementIndexByFeild(this.manufacturersAggregateResponse.data.states, '_id', event);
		if (stateIndex >= 0) {
			this.selectedState = this.manufacturersAggregateResponse.data.states[stateIndex];
			this.displayCityList = this.selectedState.cities
			this.displayLocationList = null;
		} else {
			this.selectedState = null;
			this.displayCityList = null;
			this.displayLocationList = null;
		}

		// Reset child address selection
		this.selectedCity = null;
		this.selectedLocation = null;
		this.updatedisplayManufacturerList();
	}

	public changeCity(event): void {
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
		this.updatedisplayManufacturerList();
	}

	public changeLocation(event): void {
		console.log(event);

		// Get selected city
		let index = Utils.getElementIndexByFeild(this.selectedCity.locations, '_id', event);
		if (index >= 0) {
			this.selectedLocation = this.selectedCity.locations[index];
		} else {
			this.selectedLocation = null;
		}

		// unset location
		this.updatedisplayManufacturerList();
	}

	public searchByCompanyName(searchTerm: string): void {
		if (searchTerm.length < 3) {
			this.updatedisplayManufacturerList();
			return;
		}

		let filteredBuyers: ManufacturerModel[] = [];
		if (searchTerm.length > 0) {
			this.displayManufacturerList.filter((item) => {
				if (item.companyName.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
					filteredBuyers.push(item);
				}
			});

			this.displayManufacturerList = filteredBuyers;
		}
	}

	//#endregion

	//#region Filters

	private updatedisplayManufacturerList() {
		this.displayManufacturerList = this.manufacturersAggregateResponse.data.manufacturers;

		// Filter for status
		if (this.selectedStatus && !this.selectedStatus.includes("undefined")) {
			this.displayManufacturerList = Utils.filter(this.displayManufacturerList, "status", this.selectedStatus, false);
		}

		if (this.selectedState) {
			this.displayManufacturerList = this.filterForAddress(this.displayManufacturerList);
		}
	}

	private filterForAddress(list: ManufacturerModel[]): ManufacturerModel[] {
		let temp: ManufacturerModel[] = [];
		// Filter for state
		this.displayManufacturerList.filter(manufacturer => {
			if (manufacturer.invoiceAddress && manufacturer.invoiceAddress.address.state == this.selectedState._id) {
				temp.push(manufacturer)
			}
		});

		// Filter for city
		if (this.selectedCity) {
			this.displayManufacturerList = temp;
			temp = [];

			this.displayManufacturerList.filter(manufacturer => {
				if (manufacturer.invoiceAddress && manufacturer.invoiceAddress.address.city == this.selectedCity._id) {
					temp.push(manufacturer);
				}
			});
		}

		// Filter for location
		if (this.selectedLocation) {
			this.displayManufacturerList = temp;
			temp = [];

			this.displayManufacturerList.filter(manufacturer => {
				if (manufacturer.invoiceAddress && manufacturer.invoiceAddress.address.location == this.selectedLocation._id) {
					temp.push(manufacturer);
				}
			});
		}

		return temp;
	}
	//#endregion

	//#region Error handler  
	private checkUnauthorized(handledError: HandledErrorResponse): void {
		this.toastService.error(handledError.message);

		if (handledError.code == 401) {
			AuthService.logout();
			this.router.navigate(['/login']);
		}
	}
	//#endregion

	public ClearFilter(){
		this.selectedStatus = undefined;
		this.selectedState = undefined;
		this.selectedCity = undefined;
		this.displayCityList =   null;
		this.displayLocationList = null;
		this.selectedLocation = undefined;
		this.searchCompany = "";
		this.displayManufacturerList = this.manufacturersAggregateResponse.data.manufacturers;
	}
}
