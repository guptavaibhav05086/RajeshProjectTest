import { Component, OnInit } from '@angular/core';
import { State, StateAPiResponse } from '../../models/States';
import { CompanyBasicDetails, CompanyBasicDetailsResponse } from '../../models/CompanyBasicDetails';
import { MsupplyFormRegistrationService } from '../../services/msupply-form-registration.service'
import { Observable } from 'rxjs';
import { City } from '../../models/City';

@Component({
  selector: 'app-approve-buyer',
  templateUrl: './approve-buyer.component.html',
  styleUrls: ['./approve-buyer.component.css']
})
export class ApproveBuyerComponent implements OnInit {
  approvalOptions: string[];
  approvalStatus: string;
  locations: string[];
  location: string;
  states: StateAPiResponse;
  state: State;
  cities: Array<City>;
  city: string;
  registeredManufacturers: CompanyBasicDetailsResponse;
  modalDisplay: string = 'none';
  modalObj: any = {};

  _locationRequest: CompanyBasicDetails;

  constructor(private _registrationService: MsupplyFormRegistrationService) { }

  ngOnInit() {
    this.approvalOptions=["All","New","Approved","Rejected"];
    this.loadDropdowns();// Need to uncomment later
    this.getRegisteredManufacturers();
  }

  stateChanged(selectedState) {
    
    this.cities = this.states.data.find(function (obj) { return obj._id === selectedState }).cities;
  }

  getRegisteredManufacturers() {
    this._registrationService.getBuyersList().subscribe(
      tile => {
      this.registeredManufacturers = {...tile};
      //this.loading = false;
    },
    error => {
      // this.errorMessage = <any>error;
      // this.loading = false;
    })
  }

  approveManufacturer(id: string) {

  }

  rejectManufacturer(id: string) {
    this.modalObj = {
      id: id,
      header: 'Reject Manufacturer',
      buttonText: 'Save'
    }
    this.modalDisplay = 'block';
  }

  editManufacturer(id: string) {

  }

  updateManufacturer(reason: string, id: string) {

  }

  filterData(){
    this.registeredManufacturers.data = this.registeredManufacturers.data.filter(item => item.status == this.approvalStatus)
  }

  private loadDropdowns() {
    this._registrationService.getStates().subscribe(
      response => {
      //this.states = {...response};
    });
  }

}
