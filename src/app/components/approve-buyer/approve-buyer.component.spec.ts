import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveBuyerComponent } from './approve-buyer.component';

describe('ApproveBuyerComponent', () => {
  let component: ApproveBuyerComponent;
  let fixture: ComponentFixture<ApproveBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
