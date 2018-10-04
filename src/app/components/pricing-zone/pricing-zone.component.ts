import { Component, OnInit } from '@angular/core';
import { ManufacturersWithCategoriesResponse } from '../../models/manufacturers/manufacturersWithCategoriesResponse';
import { PricingZonesResponse } from '../../models/pricing/pricingZonesResponse';
import { ManufacturerService } from '../../services/manufacturers/manufacturer.service';
import { PricingZoneService } from '../../services/pricing/pricing-zone.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ManufacturerModel } from '../../models/manufacturers/manufacturerModel';
import { ProductCategory } from '../../models/ProductCategory';
import { ProductSubCategory } from '../../models/ProductSubCategory';
import { PricingZone } from '../../models/pricing/PricingZone';
import { Utils } from '../../shared/helper/utils';
import { PricingZoneResponse } from '../../models/pricing/pricingZoneResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { Router } from '../../../../node_modules/@angular/router';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { ProductserviceService } from '../../services/productservice.service';
import { ProductResponse } from '../../models/Response';

@Component({
  selector: 'app-pricing-zone',
  templateUrl: './pricing-zone.component.html',
  styleUrls: ['./pricing-zone.component.css']
})
export class PricingZoneComponent implements OnInit {
  public loading = false;
  public manufacturerWithCategoriesResponse: ManufacturersWithCategoriesResponse;
  public manufacturerLoading: boolean;

  public pricingZonesResponse: PricingZonesResponse;
  public pricingZonesLoading: boolean;
  public displayPricingZones: PricingZone[];
  public newPriceZone: PricingZone;

  public selectedManufacturerId: string;
  public selectedCategoryId: string;
  public selectedSubCategoryId: string;
  public nullVar: string;

  constructor(
    private manufacturerService: ManufacturerService,
    private pricingZoneService: PricingZoneService,
    private productService: ProductserviceService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadManufactuereData();
    this.loadPricingZonedata();
  }

  //#region Load Data region

  private loadManufactuereData(): void {
    this.manufacturerLoading = true;
    this.updateLoading();

    this.manufacturerService.getAllManufacturersWithCategories()
      .subscribe(
        data => {
          this.manufacturerLoading = false;
          this.updateLoading();

          let response: ManufacturersWithCategoriesResponse = { ...data };
          if (!response.isValid) {
            // TODO: Iterate and concat errors
            this.toastService.error(response.errors[0]);
            return;
          }

          this.manufacturerWithCategoriesResponse = response;

          // Remove all categories and subcategories.
          this.manufacturerWithCategoriesResponse.data.categories = null;
          this.manufacturerWithCategoriesResponse.data.subCategories = null;
        },
        error => {
          this.manufacturerLoading = false;
          this.updateLoading();

          let handledError = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        }
      );
  }

  private loadManufactuereCategoryData(): void {
    this.loading = true;

    this.productService.getProductCategoryByManufacturer(this.selectedManufacturerId)
      .subscribe(
        data => {
          this.loading = false;

          let response: ProductResponse = { ...data };
          if (!response.isValid) {
            this.toastService.error(response.errors[0]);
            return;
          }

          this.manufacturerWithCategoriesResponse.data.categories = response.data.categories;
          this.manufacturerWithCategoriesResponse.data.subCategories = response.data.subCategories;
          this.selectedCategoryId = undefined;
          this.selectedSubCategoryId = undefined;
          this.updateDisplayZoneList();
        },
        error => {
          this.loading = false;

          let handledError = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        }
      );
  }

  private loadPricingZonedata(): void {
    this.pricingZonesLoading = true;
    this.updateLoading();

    this.pricingZoneService.getAllPricingZones()
      .subscribe(
        data => {
          this.pricingZonesLoading = false;
          this.updateLoading();

          let response: PricingZonesResponse = { ...data };
          if (!response.isValid) {
            // TODO: Iterate and concat errors
            this.toastService.error(response.errors[0]);
            return;
          }

          this.pricingZonesResponse = response;
        },
        error => {
          this.pricingZonesLoading = false;
          this.updateLoading();

          let handledError = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        }
      );
  }
  //#endregion

  //#region Select change listener

  public changeManufacturer(selectedManufacturerId: string): void {
    this.selectedManufacturerId = selectedManufacturerId;
    this.loadManufactuereCategoryData();
  }

  public changeCategory(selectedCategoryId: string) {
    this.selectedCategoryId = selectedCategoryId;
    this.updateDisplayZoneList();
  }

  public changeSubCategory(selectedSubCategoryId: string): void {
    this.selectedSubCategoryId = selectedSubCategoryId;
    this.updateDisplayZoneList();
  }

  public onEditClick(pricingZone: PricingZone) {
    let index = this.displayPricingZones.indexOf(pricingZone)
    this.displayPricingZones[index].isEditing = true;
  }

  public onCloseClick(pricingZone: PricingZone) {
    let index = this.displayPricingZones.indexOf(pricingZone)
    this.displayPricingZones[index].isEditing = false;
  }

  public onActiveChange(event, pricingZone: PricingZone): void {
    if (pricingZone != null) {
      let index = this.displayPricingZones.indexOf(pricingZone)
      this.displayPricingZones[index].isActive = event;
    } else {
      this.newPriceZone.isActive = event;
    }
  }

  public addPricingZone(): void {
    this.loading = true;

    // Create New zone.
    this.newPriceZone.manufacturer = new ManufacturerModel(this.selectedManufacturerId);
    this.newPriceZone.category = new ProductCategory();
    this.newPriceZone.category._id = this.selectedCategoryId;
    this.newPriceZone.subCategory = new ProductSubCategory(this.selectedSubCategoryId, null);

    // Service call
    this.pricingZoneService.addPricingZone(this.newPriceZone)
      .subscribe(
        data => {
          this.loading = false;

          let response: PricingZoneResponse = { ...data };
          if (!response.isValid) {
            // TODO: Iterate and concat errors
            this.toastService.error(response.errors[0]);
            return;
          }

          this.pricingZonesResponse.data.push(response.data);
          this.updateDisplayZoneList();
        },
        error => {
          this.loading = false;

          let handledError = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        }
      );
  }

  public onSaveClick(pricingZone: PricingZone) : void {
    this.loading = true;

    // Service call
    this.pricingZoneService.updatePricingZone(pricingZone)
      .subscribe(
        data => {
          this.loading = false;

          let response: any = { ...data };
          if (!response.isValid) {
            // TODO: Iterate and concat errors
            this.toastService.error(response.errors[0]);
            return;
          }

          // Don't remove
          //this.pricingZonesResponse.data.splice(this.pricingZonesResponse.data.indexOf(pricingZone), 1);
          this.pricingZonesResponse.data[this.pricingZonesResponse.data.indexOf(pricingZone)] = response.data;
          this.updateDisplayZoneList();
        },
        error => {
          this.loading = false;

          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        }
      );

  }

  public deletePrizingZone(pricingZone: PricingZone): void {
    this.loading = true;

    // Service call
    this.pricingZoneService.deletePricingZone(pricingZone._id)
      .subscribe(
        data => {
          this.loading = false;

          let response: any = { ...data };
          if (!response.isValid) {
            // TODO: Iterate and concat errors
            this.toastService.error(response.errors[0]);
            return;
          }

          // Don't remove
          //this.pricingZonesResponse.data.splice(this.pricingZonesResponse.data.indexOf(pricingZone), 1);
          this.pricingZonesResponse.data[this.pricingZonesResponse.data.indexOf(pricingZone)] = response.data;
          this.updateDisplayZoneList();
        },
        error => {
          this.loading = false;

          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        }
      );
  }
  //#endregion

  private updateDisplayZoneList() {
    // Flag to show add new button
    let isAllSelected = true;

    // Filter for manufacturer
    if (this.selectedManufacturerId && !this.selectedManufacturerId.includes("undefined")) {
      this.displayPricingZones = this.pricingZonesResponse.data;
      this.displayPricingZones = Utils.filter(this.displayPricingZones, 'manufacturer', this.selectedManufacturerId, true);
    } else {
      // Don't show zone unless manufacturer selected.
      this.displayPricingZones = null;
      isAllSelected = false;
      return;
    }

    // Filter for category
    if (this.selectedCategoryId && !this.selectedCategoryId.includes("undefined")) {
      this.displayPricingZones = Utils.filter(this.displayPricingZones, 'category', this.selectedCategoryId, true);
    } else {
      isAllSelected = false;
    }

    // Filter for subcategory
    if (this.selectedSubCategoryId && !this.selectedSubCategoryId.includes("undefined")) {
      this.displayPricingZones = Utils.filter(this.displayPricingZones, 'subCategory', this.selectedSubCategoryId, true);
    } else {
      isAllSelected = false;
    }

    if (isAllSelected) {
      this.newPriceZone = new PricingZone(null, null, null);
    } else {
      this.displayPricingZones = null;
      this.newPriceZone = null;
    }
  }

  private updateLoading(): void {
    this.loading = this.manufacturerLoading && this.pricingZonesLoading;
  }

  //#region Error Handling
  private checkUnauthorized(handledError: HandledErrorResponse): void {
    this.toastService.error(handledError.message);

    if (handledError.code == 401) {
      AuthService.logout();
      this.router.navigate(['/login']);
    }
  }

  //#endregion
}
