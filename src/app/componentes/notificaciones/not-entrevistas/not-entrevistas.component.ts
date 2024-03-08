import { FechaService} from '../../../servicios/fecha.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleEntrevista } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-not-entrevistas',
  templateUrl: './not-entrevistas.component.html',
  styleUrls: ['./not-entrevistas.component.css']
})
export class NotEntrevistasComponent implements OnInit,OnDestroy {

  detallesEntrevistas:DetalleEntrevista[]=[]
  cantidad:number=0
  private ngUnsubscribe = new Subject();

  constructor(private notificacionService:NotificacionService){

    this.obtenerNotificciones()
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null)
    this.ngUnsubscribe.complete()
  }

  private obtenerNotificciones(){
    this.notificacionService.obtenerEntrevistas()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (entrevistasInfo) => {
        if (entrevistasInfo) {
          this.cantidad = entrevistasInfo.entrevistas;
          this.detallesEntrevistas = entrevistasInfo.detalle_entrevistas;
        }
      }
    });
  }

  marcarLeido(entrevista:DetalleEntrevista){
    if(entrevista.leido===0){
      this.notificacionService.marcarLeido(entrevista.id)
    }
  }

}
