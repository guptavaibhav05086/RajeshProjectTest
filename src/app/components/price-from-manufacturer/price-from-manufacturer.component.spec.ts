import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFromManufacturerComponent } from './price-from-manufacturer.component';

describe('PriceFromManufacturerComponent', () => {
  let component: PriceFromManufacturerComponent;
  let fixture: ComponentFixture<PriceFromManufacturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceFromManufacturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceFromManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
