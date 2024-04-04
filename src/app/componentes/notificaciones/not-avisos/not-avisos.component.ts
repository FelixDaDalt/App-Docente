import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleAviso } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-not-avisos',
  templateUrl: './not-avisos.component.html',
  styleUrls: ['./not-avisos.component.css']
})
export class NotAvisosComponent implements OnInit,OnDestroy{

  detallesAvisos$:Observable<DetalleAviso[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionAvisos?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionAvisos?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionAvisos = this.notificacionService.obtenerAvisos()
      .pipe(
        tap(avisosInfo=>{
          this.cantidad$ = of(avisosInfo?.avisos || 0)
          this.detallesAvisos$ = of(avisosInfo?.detalle_avisos || [])
        })
      )
      .subscribe();
  }

  marcarLeido(aviso:DetalleAviso){
    if(aviso.leido===0){
      this.notificacionService.marcarLeido(aviso.id)
    }
  }

}
