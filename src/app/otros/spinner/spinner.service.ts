import { ElementRef, Injectable, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

    private activeRequests = 0;
    private spinnerSubject = new Subject<boolean>();
    spinnerState$ = this.spinnerSubject.asObservable();


    notificarSpinner(): void {
      this.activeRequests++;
      setTimeout(() => {
      this.spinnerSubject.next(true);
      }, 1);
    }

    ocultarSpinner(): void {
      this.activeRequests--;
      if (this.activeRequests <= 0) {
        this.activeRequests = 0;
        setTimeout(() => {
          this.spinnerSubject.next(false);
        }, 1);
      }
    }
  }
