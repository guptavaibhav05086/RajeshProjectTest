import { Injectable } from '@angular/core';
declare let toastr : any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  public success(message: string) : void {
    toastr.success(message);
  }

  public error(message: string) : void {
    toastr.error(message);
  }
}
