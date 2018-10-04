import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersPoDetailsComponent } from './buyers-po-details.component';

describe('BuyersPoDetailsComponent', () => {
  let component: BuyersPoDetailsComponent;
  let fixture: ComponentFixture<BuyersPoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyersPoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersPoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
