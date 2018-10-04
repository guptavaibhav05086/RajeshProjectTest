import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrderServiceService } from '../../services/purchase-order-service.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { PermissionHelper } from '../../shared/helper/permission-helper';
import { Utils } from '../../shared/helper/utils';

@Component({
  selector: 'app-buyers-po-details',
  templateUrl: './buyers-po-details.component.html',
  styleUrls: ['./buyers-po-details.component.css']
})
export class BuyersPoDetailsComponent implements OnInit {
  public poDetails = '';
  public products;
  public loading = false;
  public rejectReason: string;
  public orderId: string;
  public modalRef: NgbModalRef;
  deliveryLocation:string;

  public canApproveReject: boolean;
  public inrFormatter = Utils.formatAmountInINR;

  constructor(private modalService: NgbModal, private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: PurchaseOrderServiceService, private toastService: ToastService) {
  }

  ngOnInit() {
    this.canApproveReject = PermissionHelper.canApproveRejectOrders();
    this.orderId = this.activatedRoute.snapshot.queryParams['id'] || null;
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.loading = true;
    this.service.getOrderDetails(this.orderId).subscribe(
      (res) => {

        this.loading = false;

        if (!res.isValid) {
          this.toastService.error(res.errors[0]);
          return;
        }
        this.poDetails = res.data;
        this.products = res.data.products;
        for(var i=0; i<res.data.buyer.deliveryAddresses.length;i++){
          if(res.data.deliveryAddressId == res.data.buyer.deliveryAddresses[i]._id){
            this.deliveryLocation = res.data.buyer.deliveryAddresses[i].address.locationObj.name;
          }
        }
      },
      error => {
        this.loading = false;

        let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
        this.checkUnauthorized(handledError);
      });
  }

  rejectPo(rejectPoContent) {
    this.modalRef = this.modalService.open(rejectPoContent, { centered: true });
  }

  rejectOrder() {
    this.loading = true;
    this.service.rejectOrder(this.orderId, this.rejectReason).subscribe(
      res => {
        this.loading = false;

        if (!res.isValid) {
          this.toastService.error(res.errors[0]);
          return;
        }


        this.modalRef.close();
        this.poDetails = res.data;
        this.toastService.success('Order Rejected Successfully');
      },
      (error) => {
        this.loading = false;

        let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
        this.checkUnauthorized(handledError);
      });
  }

  onBckClk() {
    this.router.navigate(['/orders']);
  }

  ApproveOrder() {
    this.loading = true;
    this.service.approve(this.orderId).subscribe(
      res => {
        this.loading = false;
        if (!res.isValid) {
          this.toastService.error(res.errors[0]);
          return;
        }

        this.poDetails = res.data;
        this.toastService.success('Order Approved successfully');
      },
      (error) => {
        this.loading = false;

        let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
        this.checkUnauthorized(handledError);
      });
  }

  //#region Error handler
  private checkUnauthorized(handledError: HandledErrorResponse): void {
    this.toastService.error(handledError.message);

    if (handledError.code == 401) {
      AuthService.logout();
      this.router.navigate(['/login']);
    }
  }
  //#endregion


}
