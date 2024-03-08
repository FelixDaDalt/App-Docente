import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleAviso } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-not-avisos',
  templateUrl: './not-avisos.component.html',
  styleUrls: ['./not-avisos.component.css']
})
export class NotAvisosComponent implements OnInit,OnDestroy{

  detallesAvisos:DetalleAviso[]=[]
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
    this.notificacionService.obtenerAvisos()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
      next: (avisosInfo) => {
        if (avisosInfo) {
          this.cantidad = avisosInfo.avisos;
          this.detallesAvisos = avisosInfo.detalle_avisos;
        }
      }
    });
  }

  marcarLeido(aviso:DetalleAviso){
    if(aviso.leido===0){
      this.notificacionService.marcarLeido(aviso.id)
    }
  }

}
