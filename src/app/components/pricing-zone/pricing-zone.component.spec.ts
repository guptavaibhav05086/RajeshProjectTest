import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingZoneComponent } from './pricing-zone.component';

describe('PricingZoneComponent', () => {
  let component: PricingZoneComponent;
  let fixture: ComponentFixture<PricingZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
