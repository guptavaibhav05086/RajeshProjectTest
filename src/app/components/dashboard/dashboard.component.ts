import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast/toast.service';
import { HandledErrorResponse } from '../../models/shared/handledErrorResponse';
import { ServiceHelper } from '../../shared/helper/service-helper';
import { AuthService } from '../../shared/services/authentication/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data:any;
  loading: boolean = false;
  showCards: boolean = false;
  constructor(private _service: DashboardService,private router:Router, private toastService: ToastService) { }

  ngOnInit() {
    this.loading = true;
    this._service.getDashboardDetails().subscribe((res)=>{       
      this.data = res.data;
      this.showCards = true;
      this.loading = false;
       
    },(error)=>{
      this.loading = false;
      
      let handledError: HandledErrorResponse = ServiceHelper.handleErrorResponse({ ...error});
      this.checkUnauthorized(handledError);
    })
  }


  //#region Error handler
  private checkUnauthorized(handledError: HandledErrorResponse) : void {
    this.toastService.error(handledError.message);

    if (handledError.code == 401) {
      AuthService.logout();
      this.router.navigate(['/login']);
    }
  }
  //#endregion

}
