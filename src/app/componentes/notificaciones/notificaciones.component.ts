import { Component, OnDestroy, OnInit } from '@angular/core';
import { notificacion } from './notificacion';
import { NotificacionService } from './notificacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit, OnDestroy{

  notificaciones?:notificacion
  private ngUnsubscribe = new Subject();


  constructor(private notificacionService:NotificacionService){

  }
  ngOnInit(): void {
    this.obtenerNotificaciones()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null)
    this.ngUnsubscribe.complete();
  }

  obtenerNotificaciones(){
    this.notificacionService.obtenerNotificaciones()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
      next:(notificaciones)=>{
        if(notificaciones)
          this.notificaciones = notificaciones
      }
    })
  }
}
