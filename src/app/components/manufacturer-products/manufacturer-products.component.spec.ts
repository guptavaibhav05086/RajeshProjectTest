import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerProductsComponent } from './manufacturer-products.component';

describe('ManufacturerProductsComponent', () => {
  let component: ManufacturerProductsComponent;
  let fixture: ComponentFixture<ManufacturerProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
