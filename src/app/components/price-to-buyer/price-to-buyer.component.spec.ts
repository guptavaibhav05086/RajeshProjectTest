import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceToBuyerComponent } from './price-to-buyer.component';

describe('PriceToBuyerComponent', () => {
  let component: PriceToBuyerComponent;
  let fixture: ComponentFixture<PriceToBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceToBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceToBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
