import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyProductPriceManufacturerComponent } from './copy-product-price-manufacturer.component';

describe('CopyProductPriceManufacturerComponent', () => {
  let component: CopyProductPriceManufacturerComponent;
  let fixture: ComponentFixture<CopyProductPriceManufacturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyProductPriceManufacturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyProductPriceManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
