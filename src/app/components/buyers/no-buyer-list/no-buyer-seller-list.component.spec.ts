import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBuyerSellerListComponent } from './no-buyer-seller-list.component';

describe('NoBuyerSellerListComponent', () => {
  let component: NoBuyerSellerListComponent;
  let fixture: ComponentFixture<NoBuyerSellerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoBuyerSellerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoBuyerSellerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
