import { TestBed, inject } from '@angular/core/testing';

import { MappingserviceService } from './mappingservice.service';

describe('MappingserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MappingserviceService]
    });
  });

  it('should be created', inject([MappingserviceService], (service: MappingserviceService) => {
    expect(service).toBeTruthy();
  }));
});
