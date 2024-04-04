import { Component } from '@angular/core';
import { DetalleReunion } from '../notificacion';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';
import { NotificacionService } from '../notificacion.service';

@Component({
  selector: 'app-not-reuniones',
  templateUrl: './not-reuniones.component.html',
  styleUrls: ['./not-reuniones.component.css']
})
export class NotReunionesComponent {
  detallesReunion$:Observable<DetalleReunion[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionReunion?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionReunion?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionReunion = this.notificacionService.obtenerReuniones()
      .pipe(
        tap(reunionInfo=>{
          this.cantidad$ = of(reunionInfo?.rta_solicitudes_reunion || 0)
          this.detallesReunion$ = of(reunionInfo?.detalle_rta_solicitudes_reunion || [])
        })
      )
    .subscribe();
  }

  marcarLeido(reunion:DetalleReunion){
    if(reunion.leido===0){
      this.notificacionService.marcarLeido(reunion.id)
    }
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
