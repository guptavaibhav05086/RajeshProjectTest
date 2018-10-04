import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerProductPriceZoneMappingComponent } from './buyer-product-price-zone-mapping.component';

describe('BuyerProuductMappingComponent', () => {
  let component: BuyerProductPriceZoneMappingComponent;
  let fixture: ComponentFixture<BuyerProductPriceZoneMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerProductPriceZoneMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerProductPriceZoneMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
