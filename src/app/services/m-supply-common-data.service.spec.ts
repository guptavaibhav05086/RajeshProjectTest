import { TestBed, inject } from '@angular/core/testing';

import { MSupplyCommonDataService } from './m-supply-common-data.service';

describe('MSupplyCommonDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MSupplyCommonDataService]
    });
  });

  it('should be created', inject([MSupplyCommonDataService], (service: MSupplyCommonDataService) => {
    expect(service).toBeTruthy();
  }));
});
