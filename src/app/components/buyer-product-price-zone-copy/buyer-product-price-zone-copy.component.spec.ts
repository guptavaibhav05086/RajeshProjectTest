import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerProductPriceZoneCopyComponent } from './buyer-product-price-zone-copy.component';

describe('BuyerProductPriceZoneCopyComponent', () => {
  let component: BuyerProductPriceZoneCopyComponent;
  let fixture: ComponentFixture<BuyerProductPriceZoneCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerProductPriceZoneCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerProductPriceZoneCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
