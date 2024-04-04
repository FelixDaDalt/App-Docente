import { FechaService} from '../../../servicios/fecha.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleEntrevista } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatePipe } from '@angular/common';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';


@Component({
  selector: 'app-not-entrevistas',
  templateUrl: './not-entrevistas.component.html',
  styleUrls: ['./not-entrevistas.component.css']
})
export class NotEntrevistasComponent implements OnInit,OnDestroy {

  detallesEntrevista$:Observable<DetalleEntrevista[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionEntrevista?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionEntrevista?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionEntrevista = this.notificacionService.obtenerEntrevistas()
      .pipe(
        tap(entrevistaInfo=>{
          this.cantidad$ = of(entrevistaInfo?.entrevistas || 0)
          this.detallesEntrevista$ = of(entrevistaInfo?.detalle_entrevistas || [])
        })
      )
    .subscribe();
  }

  marcarLeido(entrevista:DetalleEntrevista){
    if(entrevista.leido===0){
      this.notificacionService.marcarLeido(entrevista.id)
    }
  }

}
