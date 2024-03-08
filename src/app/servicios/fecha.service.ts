import { BehaviorSubject, interval } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  private fechaYHoraActual = new BehaviorSubject<string | null>('');

  constructor(private datePipe: DatePipe) {
    this.actualizarFechaYHora();
    interval(1000).subscribe(() => {
      this.actualizarFechaYHora();
    });
  }

  private actualizarFechaYHora() {
    const fechaActual = new Date();
    const fechaYHoraFormateada = this.datePipe.transform(fechaActual, 'EEEE d MMMM y HH:mm:ss');
    this.fechaYHoraActual.next(fechaYHoraFormateada);
  }

  getFechaYHora() {
    return this.fechaYHoraActual.asObservable();
  }
}
