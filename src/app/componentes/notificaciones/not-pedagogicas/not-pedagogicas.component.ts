import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetallePedagogico } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-not-pedagogicas',
  templateUrl: './not-pedagogicas.component.html',
  styleUrls: ['./not-pedagogicas.component.css']
})
export class NotPedagogicasComponent implements OnInit,OnDestroy{

  detallesPedagogico$:Observable<DetallePedagogico[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionPedagogico?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionPedagogico?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionPedagogico = this.notificacionService.obtenerPedagogico()
      .pipe(
        tap(pedagogicoInfo=>{
          this.cantidad$ = of(pedagogicoInfo?.pedagogicas || 0)
          this.detallesPedagogico$ = of(pedagogicoInfo?.detalle_pedagogicos || [])
        })
      )
    .subscribe();
  }

  marcarLeido(pedagogico:DetallePedagogico){
    if(pedagogico.leido===0){
      this.notificacionService.marcarLeido(pedagogico.id)
    }
  }
}
