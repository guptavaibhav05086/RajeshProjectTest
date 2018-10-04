import { Component, OnInit,Input } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-zone-in-pricing',
  templateUrl: './add-zone-in-pricing.component.html',
  styleUrls: ['./add-zone-in-pricing.component.css']
})
export class AddZoneInPricingComponent implements OnInit {

  @Input() name;
  @Input() zoneList;
  selectedZone:any;
  result={
    prodId:'',
    zoneId:''
  }
  constructor(public activeModal: NgbActiveModal) {
    
   }

  ngOnInit() {
    this.result.prodId = this.name;
  }

}
