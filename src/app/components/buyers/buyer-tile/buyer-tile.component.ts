import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompanyBasicDetails } from '../../../models/CompanyBasicDetails';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { BuyerService } from '../../../services/buyers/buyer.service';
import { BuyerResponseModel } from '../../../models/buyers/buyerResponseModel';
import { HandledErrorResponse } from '../../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../../shared/helper/service-helper';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { PermissionHelper } from '../../../shared/helper/permission-helper';
import { Utils } from '../../../shared/helper/utils';

@Component({
	selector: 'app-buyer-tile',
	templateUrl: './buyer-tile.component.html',
	styleUrls: ['./buyer-tile.component.css']
})
export class BuyerTileComponent implements OnInit {
	@Input() buyer: CompanyBasicDetails;
	
	public canEdit: boolean;
	public canApproveReject: boolean;

	public loading: Boolean;
	public errorMessage: any;
	@Output() rejectClickEvent = new EventEmitter();

	public inrFormatter = Utils.formatAmountInINR;
	
	constructor(
		private router: Router,
		private toastService: ToastService,
		private buyerService: BuyerService
	) { }

	ngOnInit() {
		this.canEdit = PermissionHelper.canAddEditBuyer();
		this.canApproveReject = PermissionHelper.canApproveRejectBuyer();
	}

	//#region onClick Handlers
	public onApproveButtonClick(): void {
		if (this.buyer.status == 'Approved') {
			this.toastService.error(`Buyer ${this.buyer.companyName} is already approved!`)
			return;
		}

		this.approveBuyer();
	}

	public onEditBuyerButtonClick(): void {
		this.router.navigate(['buyers-registration'], { queryParams: { id: this.buyer._id } });
	}

	public onRejectButtonClick(): void {
		if (this.buyer.status == 'Rejected') {
			this.toastService.error(`Buyer ${this.buyer.companyName} is already rejected!`)
			return;
		}

		this.rejectClickEvent.emit(this.buyer._id);
	}
	//#endregion

	private approveBuyer(): void {
		this.loading = true;
		this.buyerService.approveBuyer(this.buyer._id)
			.subscribe(
				data => {
					this.loading = false;
					let response: BuyerResponseModel = { ...data };
					if (!response.isValid) {
						this.toastService.error(response.errors[0]);
						return;
					}

					this.buyer = response.data;
					this.toastService.success(`Buyer ${this.buyer.companyName} is approved!`);
				},
				error => {
					this.loading = false;

					let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
					this.checkUnauthorized(handledError);
				}
			);
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
