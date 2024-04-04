import { Component, OnDestroy, OnInit } from '@angular/core';
import { notificacion } from './notificacion';
import { NotificacionService } from './notificacion.service';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit, OnDestroy{

  notificaciones$:Observable<notificacion | null> = of(null)
  notificacionesSusripcion?:Subscription


  constructor(private notificacionService:NotificacionService,
    private route:Router){

  }
  ngOnInit(): void {
    this.obtenerNotificaciones()
  }

  ngOnDestroy(): void {
    this.notificacionesSusripcion?.unsubscribe()
  }

  obtenerNotificaciones(){
    this.notificacionesSusripcion = this.notificacionService.obtenerNotificaciones()
      .pipe(
        tap(notificaciones=>this.notificaciones$= of(notificaciones))
      )
      .subscribe()
  }

  navegarNotificacion(notificacion:string){
    this.route.navigate(['dashboard','notificaciones',notificacion])
  }
}
