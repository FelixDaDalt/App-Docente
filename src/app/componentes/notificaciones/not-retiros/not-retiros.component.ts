import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleRetiros } from '../notificacion';
import { Subject, takeUntil } from 'rxjs';
import { NotificacionService } from '../notificacion.service';

@Component({
  selector: 'app-not-retiros',
  templateUrl: './not-retiros.component.html',
  styleUrls: ['./not-retiros.component.css']
})
export class NotRetirosComponent implements OnInit,OnDestroy{
  detalleRetiros:DetalleRetiros[]=[]
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
    this.notificacionService.obtenerRetiros()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
      next: (retirosInfo) => {
        if (retirosInfo) {
          this.cantidad = retirosInfo.avisos_retiro;
          this.detalleRetiros = retirosInfo.detalle_avisos_retiro;
        }
      }
    });
  }

  marcarLeido(retiro:DetalleRetiros){
    if(retiro.leido===0){
      this.notificacionService.marcarLeido(retiro.id)
    }
  }
}

