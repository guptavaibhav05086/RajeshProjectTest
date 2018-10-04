import { TestBed, inject } from '@angular/core/testing';

import { PurchaseOrderServiceService } from './purchase-order-service.service';

describe('PurchaseOrderServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchaseOrderServiceService]
    });
  });

  it('should be created', inject([PurchaseOrderServiceService], (service: PurchaseOrderServiceService) => {
    expect(service).toBeTruthy();
  }));
});
