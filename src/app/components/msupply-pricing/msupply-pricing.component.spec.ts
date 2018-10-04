import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsupplyPricingComponent } from './msupply-pricing.component';

describe('MsupplyPricingComponent', () => {
  let component: MsupplyPricingComponent;
  let fixture: ComponentFixture<MsupplyPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsupplyPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsupplyPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
