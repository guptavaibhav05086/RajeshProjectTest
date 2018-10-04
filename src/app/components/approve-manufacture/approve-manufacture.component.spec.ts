import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveManufactureComponent } from './approve-manufacture.component';

describe('ApproveManufactureComponent', () => {
  let component: ApproveManufactureComponent;
  let fixture: ComponentFixture<ApproveManufactureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveManufactureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
