import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleFalta } from '../notificacion';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { NotificacionService } from '../notificacion.service';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-not-faltas',
  templateUrl: './not-faltas.component.html',
  styleUrls: ['./not-faltas.component.css']
})
export class NotFaltasComponent implements OnInit,OnDestroy{


  detallesFalta$:Observable<DetalleFalta[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionFalta?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionFalta?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionFalta = this.notificacionService.obtenerFaltas()
      .pipe(
        tap(faltaInfo=>{
          this.cantidad$ = of(faltaInfo?.faltas || 0)
          this.detallesFalta$ = of(faltaInfo?.detalle_faltas || [])
        })
      )
    .subscribe();
  }

  marcarLeido(falta:DetalleFalta){
    if(falta.leido===0){
      this.notificacionService.marcarLeido(falta.id)
    }
  }

}
