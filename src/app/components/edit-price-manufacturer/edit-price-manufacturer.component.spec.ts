import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPriceManufacturerComponent } from './edit-price-manufacturer.component';

describe('EditPriceManufacturerComponent', () => {
  let component: EditPriceManufacturerComponent;
  let fixture: ComponentFixture<EditPriceManufacturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPriceManufacturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPriceManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
