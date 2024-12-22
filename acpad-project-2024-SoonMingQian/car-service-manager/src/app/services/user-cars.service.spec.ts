import { TestBed } from '@angular/core/testing';

import { UserCarsService } from './user-cars.service';

describe('UserCarsService', () => {
  let service: UserCarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
