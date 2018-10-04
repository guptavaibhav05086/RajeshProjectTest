import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BuyersPurchaseOrderComponent } from './components/buyers-purchase-order/buyers-purchase-order.component';
import { PriceFromManufacturerComponent } from './components/price-from-manufacturer/price-from-manufacturer.component'
import { BasicDetailsComponent } from './components/buyer-registration/buyer-registration.component';
import { ManufacturerListComponent } from './components/manufacturers/manufacturer-list/manufacturer-list.component'
import { ManufacturerRegistrationComponent } from './components/manufacturer-registration/manufacturer-registration.component'
import { BuyerListComponent } from './components/buyers/buyer-list/buyer-list.component'
import { BuyersPoDetailsComponent } from './components/buyers-po-details/buyers-po-details.component'
import { MsupplyPricingComponent } from './components/msupply-pricing/msupply-pricing.component'
import { PricingZoneComponent } from './components/pricing-zone/pricing-zone.component'
import { ProductDetailsComponent } from './components/product-details/product-details.component'
import { ApproveManufactureComponent } from './components/approve-manufacture/approve-manufacture.component'
import { UserManagementComponent } from './components/user-management/user-management.component'
import { ApproveBuyerComponent } from './components/approve-buyer/approve-buyer.component'
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component'
import { PriceToBuyerComponent } from './components/price-to-buyer/price-to-buyer.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ManufacturerProductsComponent } from './components/manufacturer-products/manufacturer-products.component';
import { AdminGuardGuard } from './admin-guard.guard';

const routes: Routes = [
    { path: 'login', component: LoginPageComponent},

    {
      path: '', canActivate: [AuthGuard], children: [
          { path: '', component: DashboardComponent},
          { path: 'manufacturers', component: ManufacturerListComponent },
          { path: 'buyers' ,  component: BuyerListComponent },
          { path: 'manufacturers-registration' ,  component: ManufacturerRegistrationComponent },
          { path: 'manufacturers-products' ,  component: ManufacturerProductsComponent },
          { path: 'pricing-to-msupply' ,  component: PriceFromManufacturerComponent },
          { path: 'buyers-registration' ,  component: BasicDetailsComponent },
          { path: 'buyer-pricing' ,  component: PriceToBuyerComponent },
          { path: 'orders' ,  component: BuyersPurchaseOrderComponent },
          { path: 'orders-details' ,  component: BuyersPoDetailsComponent },
          { path: 'msupply-pricing' ,  component: PriceToBuyerComponent },
          { path: 'pricing-zone' ,  component: PricingZoneComponent },
          { path: 'product-details' ,  component: ProductDetailsComponent },
          { path: 'approve-manufacture' ,  component: ApproveManufactureComponent },
           {path: 'user' ,  component: UserManagementComponent, canActivate: [AdminGuardGuard] },
          { path: 'approve-buyer' ,  component: ApproveBuyerComponent },
          {path:  'user-new', component: AddNewUserComponent}
      ]
    },
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
      RouterModule
   ] 
})
export class RoutingModule { };