import { TestBed, inject } from '@angular/core/testing';

import { AccountGmailFirebaseService } from './account-gmail-firebase.service';

describe('AccountGmailFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountGmailFirebaseService]
    });
  });

  it('should be created', inject([AccountGmailFirebaseService], (service: AccountGmailFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
