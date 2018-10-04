import { TestBed, inject } from '@angular/core/testing';

import { MsupplyproductpricingService } from './msupplyproductpricing.service';

describe('MsupplyproductpricingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsupplyproductpricingService]
    });
  });

  it('should be created', inject([MsupplyproductpricingService], (service: MsupplyproductpricingService) => {
    expect(service).toBeTruthy();
  }));
});
