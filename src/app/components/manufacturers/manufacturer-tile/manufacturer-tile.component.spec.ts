import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerTileComponent } from './manufacturer-tile.component';

describe('ManufacturerTileComponent', () => {
  let component: ManufacturerTileComponent;
  let fixture: ComponentFixture<ManufacturerTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
