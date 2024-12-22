import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mechanicAuthGuard } from './mechanic-auth.guard';

describe('mechanicAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mechanicAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
