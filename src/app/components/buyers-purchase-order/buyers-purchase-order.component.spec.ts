import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersPurchaseOrderComponent } from './buyers-purchase-order.component';

describe('BuyersPurchaseOrderComponent', () => {
  let component: BuyersPurchaseOrderComponent;
  let fixture: ComponentFixture<BuyersPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyersPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
