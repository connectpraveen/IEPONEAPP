import { TestBed, inject } from '@angular/core/testing';

import { AccountPhoneFirebaseService } from './account-phone-firebase.service';

describe('AccountPhoneFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountPhoneFirebaseService]
    });
  });

  it('should be created', inject([AccountPhoneFirebaseService], (service: AccountPhoneFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
