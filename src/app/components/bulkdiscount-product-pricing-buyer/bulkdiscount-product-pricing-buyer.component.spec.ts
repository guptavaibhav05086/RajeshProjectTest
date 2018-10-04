import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkdiscountProductPricingBuyerComponent } from './bulkdiscount-product-pricing-buyer.component';

describe('BulkdiscountProductPricingBuyerComponent', () => {
  let component: BulkdiscountProductPricingBuyerComponent;
  let fixture: ComponentFixture<BulkdiscountProductPricingBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkdiscountProductPricingBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkdiscountProductPricingBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
