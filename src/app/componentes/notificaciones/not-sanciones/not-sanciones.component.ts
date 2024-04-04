import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleSancion } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-not-sanciones',
  templateUrl: './not-sanciones.component.html',
  styleUrls: ['./not-sanciones.component.css']
})
export class NotSancionesComponent implements OnInit,OnDestroy{
   detallesSancion$:Observable<DetalleSancion[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionSancion?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionSancion?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionSancion = this.notificacionService.obtenerSanciones()
      .pipe(
        tap(reunionInfo=>{
          this.cantidad$ = of(reunionInfo?.sanciones || 0)
          this.detallesSancion$ = of(reunionInfo?.detalle_sanciones || [])
        })
      )
    .subscribe();
  }

  marcarLeido(reunion:DetalleSancion){
    if(reunion.leido===0){
      this.notificacionService.marcarLeido(reunion.id)
    }
  }
}
