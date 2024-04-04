import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleRetiros } from '../notificacion';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';
import { NotificacionService } from '../notificacion.service';

@Component({
  selector: 'app-not-retiros',
  templateUrl: './not-retiros.component.html',
  styleUrls: ['./not-retiros.component.css']
})
export class NotRetirosComponent implements OnInit,OnDestroy{
  detallesRetiro$:Observable<DetalleRetiros[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionRetiro?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionRetiro?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionRetiro = this.notificacionService.obtenerRetiros()
      .pipe(
        tap(retiroInfo=>{
          this.cantidad$ = of(retiroInfo?.avisos_retiro || 0)
          this.detallesRetiro$ = of(retiroInfo?.detalle_avisos_retiro || [])
        })
      )
    .subscribe();
  }

  marcarLeido(retiro:DetalleRetiros){
    if(retiro.leido===0){
      this.notificacionService.marcarLeido(retiro.id)
    }
  }
}

