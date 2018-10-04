import { TestBed, inject } from '@angular/core/testing';

import { PricingZoneService } from './pricing-zone.service';

describe('PricingZoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricingZoneService]
    });
  });

  it('should be created', inject([PricingZoneService], (service: PricingZoneService) => {
    expect(service).toBeTruthy();
  }));
});
