import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerRegistrationComponent } from './manufacturer-registration.component';

describe('ManufacturerRegistrationComponent', () => {
  let component: ManufacturerRegistrationComponent;
  let fixture: ComponentFixture<ManufacturerRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
