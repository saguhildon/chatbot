import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import {NotificationService} from '@progress/kendo-angular-notification';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
