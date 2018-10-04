import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '../../../services/user-profile.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { UserProfile } from '../../../models/user/user-profile';
import { AuthService } from '../../../shared/services/authentication/auth.service';
// import { AuthService } from '../../../shared/services/Authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('updateUserForm') UpdateUserForm: any;
  public data;
  public showUSerForm: boolean = false;

  firstNametxt: any;
  lastNametxt: any;
  emailTxt: any;
  mobileNumber: any;
  changePassword: any;
  currentPasswordText: any = '';
  newPasswordText: any = '';
  ConfirmPasswordText: any = '';


  constructor(public router: Router, private modalService: NgbModal,
    private _service: UserProfileService, private toast: ToastService) { }

  ngOnInit() {
  }

  openProfile(profile) {
    //let id1 = this._authService.getUserData();
    this.modalService.open(profile, { size: 'lg' })

    let userProfile: UserProfile = AuthService.getUserData();
    if (!userProfile) {
      this.toast.error("Something went wrong!");
    }

    this.data = userProfile.user;

    this.mobileNumber = this.data.mobileNumber;
    this.firstNametxt = this.data.firstName;
    this.lastNametxt = this.data.lastName;
    this.emailTxt = this.data.emailId;
  }


  updateUser(updateUserForm: NgForm) {
    let formvalue = updateUserForm.value;
    if (updateUserForm.valid) {
      console.log("Form Submitted!");
      if (formvalue.changePassword == undefined || formvalue.changePassword == false) {
        let reqBody = {};
        reqBody["firstName"] = formvalue.firstName;
        reqBody["lastName"] = formvalue.lastName;
        reqBody["emailId"] = formvalue.email;
        reqBody["_id"] = this.data._id;
        console.log(reqBody)
        this._service.updateUserProfile(reqBody).subscribe((res) => {
          console.log(res);
          if (res.emailId) {
            console.log('valid ')
            this.toast.success('User details updated successfully')
          } else {
            this.toast.error(res.message);
          }
        }, (error) => {
          console.log(error)
        })
      }
      else if (formvalue.ConfirmPassword === formvalue.newPassword) {
        let reqBody = {};
        reqBody["newPassword"] = formvalue.newPassword;
        reqBody["emailId"] = this.data.emailId;
        reqBody["currentPassword"] = formvalue.currentPassword;
        this._service.resetPassword(reqBody).subscribe((res) => {
          console.log(res);
          if (res.isvalid) {
            console.log('valid ')
            this.toast.success('User details updated successfully')
          } else {
            this.toast.error(res.message);
          }
        }, (error) => {
          this.toast.error(error.errors[0])
        })
      }
    }
  }

  signOut(){
    AuthService.logout();
    this.router.navigate(['/login']);
  }


  updateProfile() {

  }

}
