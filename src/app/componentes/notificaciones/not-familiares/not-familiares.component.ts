import { Component } from '@angular/core';
import { DetalleFamiliar } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-not-familiares',
  templateUrl: './not-familiares.component.html',
  styleUrls: ['./not-familiares.component.css']
})
export class NotFamiliaresComponent {


  detallesFamiliar$:Observable<DetalleFamiliar[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionFamiliar?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionFamiliar?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionFamiliar = this.notificacionService.obtenerFamiliares()
      .pipe(
        tap(familiarInfo=>{
          this.cantidad$ = of(familiarInfo?.familiares || 0)
          this.detallesFamiliar$ = of(familiarInfo?.detalle_familiares || [])
        })
      )
    .subscribe();
  }

  marcarLeido(familiar:DetalleFamiliar){
    if(familiar.leido===0){
      this.notificacionService.marcarLeido(familiar.id)
    }
  }
}
