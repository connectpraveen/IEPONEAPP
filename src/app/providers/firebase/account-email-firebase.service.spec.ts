import { TestBed, inject } from '@angular/core/testing';

import { AccountEmailFirebaseService } from './account-email-firebase.service';

describe('AccountEmailFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountEmailFirebaseService]
    });
  });

  it('should be created', inject([AccountEmailFirebaseService], (service: AccountEmailFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
