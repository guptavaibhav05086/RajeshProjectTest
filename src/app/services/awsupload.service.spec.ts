import { TestBed, inject } from '@angular/core/testing';

import { AwsuploadService } from './awsupload.service';

describe('AwsuploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AwsuploadService]
    });
  });

  it('should be created', inject([AwsuploadService], (service: AwsuploadService) => {
    expect(service).toBeTruthy();
  }));
});
