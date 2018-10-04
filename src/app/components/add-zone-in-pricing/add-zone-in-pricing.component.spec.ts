import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddZoneInPricingComponent } from './add-zone-in-pricing.component';

describe('AddZoneInPricingComponent', () => {
  let component: AddZoneInPricingComponent;
  let fixture: ComponentFixture<AddZoneInPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddZoneInPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddZoneInPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
