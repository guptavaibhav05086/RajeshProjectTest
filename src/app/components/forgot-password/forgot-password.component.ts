import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { UserProfileService } from '../../services/user-profile.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public loading: boolean;
  public email: string;
  public emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  
  constructor(	private toast: ToastService,
    private _service: UserProfileService,
    public activeModal: NgbActiveModal,) { }

  ngOnInit() {
  }

  forgotPassword(){
    console.log(this.email);
    if(this.email == undefined ||  this.email == null || this.email == ""){
      this.toast.error("emailId required");
      return;
    }

    if(!this.emailPattern.test(this.email)){
      this.toast.error("valid emailId required");
      return;
    }

    let reqBody = {};
    reqBody["emailId"] = this.email;
    this._service.forgotPassword(reqBody).subscribe((res) => {
      console.log(res);
      if (res.isvalid) {
        console.log('valid ')
        this.toast.success(res.message)
      } else {
        this.toast.error(res.message);
      }
    }, (error) => {
      this.toast.error(error.errors[0])
    })
    this.activeModal.close('Close click');

  }

}
