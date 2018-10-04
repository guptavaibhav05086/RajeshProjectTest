import { TestBed, inject } from '@angular/core/testing';

import { .\services\Authentication\authService } from './.\services\authentication\auth.service';

describe('.\services\Authentication\authService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [.\services\Authentication\authService]
    });
  });

  it('should be created', inject([.\services\Authentication\authService], (service: .\services\Authentication\authService) => {
    expect(service).toBeTruthy();
  }));
});
