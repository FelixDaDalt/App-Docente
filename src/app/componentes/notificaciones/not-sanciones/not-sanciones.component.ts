import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleSancion } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-not-sanciones',
  templateUrl: './not-sanciones.component.html',
  styleUrls: ['./not-sanciones.component.css']
})
export class NotSancionesComponent implements OnInit,OnDestroy{
  detalleSanciones:DetalleSancion[]=[]
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
    this.notificacionService.obtenerSanciones()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
      next: (sancionesInfo) => {
        if (sancionesInfo) {
          this.cantidad = sancionesInfo.sanciones;
          this.detalleSanciones = sancionesInfo.detalle_sanciones;
        }
      }
    });
  }

  marcarLeido(sancion:DetalleSancion){
    if(sancion.leido===0){
      this.notificacionService.marcarLeido(sancion.id)
    }
  }
}
