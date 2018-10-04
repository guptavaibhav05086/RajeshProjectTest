import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductModalComponent } from './add-edit-product-modal.component';

describe('AddEditProductModalComponent', () => {
  let component: AddEditProductModalComponent;
  let fixture: ComponentFixture<AddEditProductModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProductModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
