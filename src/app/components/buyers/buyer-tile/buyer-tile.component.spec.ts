import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerTileComponent } from './buyer-tile.component';

describe('BuyerTileComponent', () => {
  let component: BuyerTileComponent;
  let fixture: ComponentFixture<BuyerTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
