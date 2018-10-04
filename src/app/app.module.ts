import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RoutingModule } from './routing.module';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { LoadingModule } from 'ngx-loading';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { HeaderComponent } from './components/shared/header/header.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardCardComponent } from './components/dashboard/dashboard-card/dashboard-card.component';
import { LeftNavBarComponent } from './components/shared/left-nav-bar/left-nav-bar.component';
import { BuyersPurchaseOrderComponent } from './components/buyers-purchase-order/buyers-purchase-order.component';
import { AuthService } from './shared/services/authentication/auth.service';
import { HttpClientModule } from '@angular/common/http';
import {MSupplyCommonDataService } from './services/m-supply-common-data.service'
//import { AppComponent } from './app.component';
import { BasicDetailsComponent } from './components/buyer-registration/buyer-registration.component';
import {EditPriceManufacturerComponent } from './components/edit-price-manufacturer/edit-price-manufacturer.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { AwsuploadService } from './services/awsupload.service';
import { MsupplyFormRegistrationService } from './services/msupply-form-registration.service';
import { PriceFromManufacturerComponent } from './components/price-from-manufacturer/price-from-manufacturer.component';
import { MsupplyproductpricingService } from './services/msupplyproductpricing.service';
import { ManufacturerListComponent } from './components/manufacturers/manufacturer-list/manufacturer-list.component';
import { ManufacturerRegistrationComponent } from './components/manufacturer-registration/manufacturer-registration.component';
import { BuyerListComponent } from './components/buyers/buyer-list/buyer-list.component';
import { BuyersPoDetailsComponent } from './components/buyers-po-details/buyers-po-details.component';
import { MsupplyPricingComponent } from './components/msupply-pricing/msupply-pricing.component';
import { PricingZoneComponent } from './components/pricing-zone/pricing-zone.component'
import { ProductDetailsComponent } from './components/product-details/product-details.component'
import { AddEditProductModalComponent } from './components/add-edit-product-modal/add-edit-product-modal.component'
import { ApproveManufactureComponent } from './components/approve-manufacture/approve-manufacture.component';
import { ReasonModalComponent } from './components/shared/reason-modal/reason-modal.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ApproveBuyerComponent } from './components/approve-buyer/approve-buyer.component';
import { UserManagementService } from './services/user-management.service'; 
import { ToastService } from './shared/services/toast/toast.service';
import { BuyerTileComponent } from './components/buyers/buyer-tile/buyer-tile.component';
import { NoBuyerSellerListComponent } from './components/buyers/no-buyer-list/no-buyer-seller-list.component';
import { ManufacturerTileComponent } from './components/manufacturers/manufacturer-tile/manufacturer-tile.component';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { CopyProductPriceManufacturerComponent } from './components/copy-product-price-manufacturer/copy-product-price-manufacturer.component';
import { BuyerProductPriceZoneMappingComponent } from './components/buyer-product-price-zone-mapping/buyer-product-price-zone-mapping.component';
import { BuyerProductPriceZoneCopyComponent } from './components/buyer-product-price-zone-copy/buyer-product-price-zone-copy.component';
import { PriceToBuyerComponent } from './components/price-to-buyer/price-to-buyer.component';
import { AddZoneInPricingComponent } from './components/add-zone-in-pricing/add-zone-in-pricing.component'
import { BulkdiscountProductPricingBuyerComponent } from './components/bulkdiscount-product-pricing-buyer/bulkdiscount-product-pricing-buyer.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ViewHistoryComponent } from './components/view-history/view-history.component';
import { ManufacturerProductsComponent } from './components/manufacturer-products/manufacturer-products.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PaginationService } from './shared/helper/pagination-helper';
import { IndianCurrency } from './pipe/indianCurrency.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    DashboardComponent,
    DashboardCardComponent,
    LeftNavBarComponent,
    BuyersPurchaseOrderComponent,
    BasicDetailsComponent,
    ProductDetailsComponent,
    PriceFromManufacturerComponent,
    ManufacturerListComponent,
    ManufacturerRegistrationComponent,
    BuyerListComponent,
    BuyersPoDetailsComponent,
    MsupplyPricingComponent,
    PricingZoneComponent,
    EditPriceManufacturerComponent,
    AddEditProductModalComponent,
    ApproveManufactureComponent,
    ReasonModalComponent,
    UserManagementComponent,
    ApproveBuyerComponent,    
    BuyerTileComponent,
    NoBuyerSellerListComponent,
    ManufacturerTileComponent,
    AddNewUserComponent,
    CopyProductPriceManufacturerComponent,
    BuyerProductPriceZoneMappingComponent,
    BuyerProductPriceZoneCopyComponent,
    PriceToBuyerComponent,
    BulkdiscountProductPricingBuyerComponent,
    AddZoneInPricingComponent,
    ViewHistoryComponent,
    ManufacturerProductsComponent,
    ForgotPasswordComponent,
    IndianCurrency
  ],
  imports: [
    RoutingModule,
    HttpClientModule,
    BrowserModule,
    DataTablesModule,
    FormsModule,
    LoadingModule,
    NgbModule.forRoot(),
    LoadingModule,
    UiSwitchModule.forRoot({
      size: 'medium',
      color: 'rgb(0, 189, 99)',
      switchColor: '#80FFA2',
      defaultBgColor: '#E36536',
      defaultBoColor : '#476EFF',
    })

  ],
  entryComponents: [
    EditPriceManufacturerComponent,
    AddEditProductModalComponent,
    CopyProductPriceManufacturerComponent,
    BuyerProductPriceZoneMappingComponent,
    BuyerProductPriceZoneCopyComponent,
    BulkdiscountProductPricingBuyerComponent,
    AddZoneInPricingComponent,
    ViewHistoryComponent,
    ForgotPasswordComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    MSupplyCommonDataService,
    MsupplyFormRegistrationService,
    MsupplyproductpricingService,
    ToastService,
    UserManagementService,
    PaginationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
