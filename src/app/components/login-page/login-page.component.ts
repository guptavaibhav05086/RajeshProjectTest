import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/authentication/auth.service';
import { UserProfile } from '../../models/user/user-profile';
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public user: UserProfile;
  public returnUrl: string;
  public loading: boolean;
  public rememberMe: boolean;
  public isEmailValid:boolean;
public 
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.isEmailValid = true;
    if (this.returnUrl.includes("login")) {
      this.returnUrl = '/';
    }

    // TODO: 
    this.returnUrl = '/';
    
    if (AuthService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }
  validateEmail(email:string){
if(email.includes('@')){
this.isEmailValid = true;
}
else{
  this.isEmailValid = false;
}
  }
  openFrgtPswrdModel() {
    //this.modalService.open(content, { centered: true });
    const modalRef = this.modalService.open(ForgotPasswordComponent, { centered: true });
    modalRef.result.then(result=> 
      {
        
      });
  }
  login(loginForm: NgForm) {
    let formvalue = loginForm.value;

    if(formvalue.email == "" || formvalue.password == ""){
      this.toastService.error("login credentials required.");
    }else{
      this.loading = true;
      this.authService.login('http://13.127.174.94:3350/login', formvalue)
      .subscribe(
        user => {
          this.loading = false
          let response: any = { ...user };

          if (response.isvalid) {
            AuthService.saveUserData(response, this.rememberMe);
            this.router.navigate([this.returnUrl]);
          } else {
            this.toastService.error(response.message);
          }
        },
        error => {
          this.loading = false;

          let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error });
          this.checkUnauthorized(handledError);
        });
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
