import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { ManufacturerService } from '../../../services/manufacturers/manufacturer.service';
import { ManufacturerResponseModel } from '../../../models/manufacturers/manufacturerResponseModel';
import { ManufacturerModel } from '../../../models/manufacturers/manufacturerModel';
import { HandledErrorResponse } from '../../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../../shared/helper/service-helper';
import { AuthService } from '../../../shared/services/authentication/auth.service';
import { PermissionHelper } from '../../../shared/helper/permission-helper';

@Component({
  selector: 'app-manufacturer-tile',
  templateUrl: './manufacturer-tile.component.html',
  styleUrls: ['./manufacturer-tile.component.css']
})
export class ManufacturerTileComponent implements OnInit {
  @Input() manufacturer: ManufacturerModel;

  public loading: Boolean;
  public errorMessage: any;
  @Output() rejectClickEvent = new EventEmitter();

	public canEdit: boolean;
	public canApproveReject: boolean;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private manufacturerService: ManufacturerService
  ) { }

  ngOnInit() {
		this.canEdit = PermissionHelper.canAddEditManufacturer();
		this.canApproveReject = PermissionHelper.canApproveRejectManufacturer();
  }

  //#region onClick Handlers
  public onApproveButtonClick() : void {
    if (this.manufacturer.status == 'Approved') {
      this.toastService.error(`Manufacturer ${this.manufacturer.companyName} is already approved!`)
      return;
    }
    
    this.approveManufacturer();
  }

  public onEditManufacturerButtonClick() : void {
    this.router.navigate(['manufacturers-registration'], { queryParams: { id: this.manufacturer._id }});
  }

  public onRejectButtonClick() : void {
    if (this.manufacturer.status == 'Rejected') {
      this.toastService.error(`Manufacturer ${this.manufacturer.companyName} is already rejected!`)
      return;
    }

    this.rejectClickEvent.emit(this.manufacturer._id);
  }
  //#endregion

  private approveManufacturer(): void {
    this.loading = true;
    this.manufacturerService.approveManufacturer(this.manufacturer._id)
      .subscribe(
        data => {
          this.loading = false;
          this.checkForError({ ...data });
        },
        error => {
          this.loading = false;

          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        }
      );
  }

  private checkForError(response: ManufacturerResponseModel) : void{
    if (response.isValid) {
      this.manufacturer = response.data;
      this.toastService.success(`Manufacturer ${this.manufacturer.companyName} is approved!`);
    } else {
      this.toastService.error(response.errors[0]);
    }
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
