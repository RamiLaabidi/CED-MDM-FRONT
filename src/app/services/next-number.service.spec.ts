import { TestBed } from '@angular/core/testing';

import { NextNumberService } from './next-number.service';

describe('NextNumberService', () => {
  let service: NextNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
