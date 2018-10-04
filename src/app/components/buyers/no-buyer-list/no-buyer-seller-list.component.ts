import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionHelper } from '../../../shared/helper/permission-helper';

@Component({
  selector: 'app-no-buyer-seller-list',
  templateUrl: './no-buyer-seller-list.component.html',
  styleUrls: ['./no-buyer-seller-list.component.css']
})
export class NoBuyerSellerListComponent implements OnInit {
  @Input() name: string;
  @Input() navRoute: string

  @Input() canEdit: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public onNewButtonClick() {
    this.router.navigate([this.navRoute])
  }
}
