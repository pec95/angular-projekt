import { TestBed } from '@angular/core/testing';

import { UclService } from './ucl.service';

describe('UclService', () => {
  let service: UclService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UclService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
