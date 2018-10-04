import { TestBed, inject } from '@angular/core/testing';

import { MsupplyFormRegistrationService } from './msupply-form-registration.service';

describe('MsupplyFormRegistrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsupplyFormRegistrationService]
    });
  });

  it('should be created', inject([MsupplyFormRegistrationService], (service: MsupplyFormRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
