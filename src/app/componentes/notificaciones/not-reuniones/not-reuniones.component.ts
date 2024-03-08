import { Component } from '@angular/core';
import { DetalleReunion } from '../notificacion';
import { Subject, takeUntil } from 'rxjs';
import { NotificacionService } from '../notificacion.service';

@Component({
  selector: 'app-not-reuniones',
  templateUrl: './not-reuniones.component.html',
  styleUrls: ['./not-reuniones.component.css']
})
export class NotReunionesComponent {
  detalleReuniones:DetalleReunion[]=[]
  cantidad:number=0
  private ngUnsubscribe = new Subject();

  constructor(private notificacionService:NotificacionService){

  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null)
    this.ngUnsubscribe.complete()
  }

  private obtenerNotificciones(){
    this.notificacionService.obtenerReuniones()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
      next: (reunionesInfo) => {
        if (reunionesInfo) {
          this.cantidad = reunionesInfo.rta_solicitudes_reunion;
          this.detalleReuniones = reunionesInfo.detalle_rta_solicitudes_reunion;
        }
      }
    });
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
