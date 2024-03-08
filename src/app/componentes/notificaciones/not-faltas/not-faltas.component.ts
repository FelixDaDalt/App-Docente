import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleFalta } from '../notificacion';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { NotificacionService } from '../notificacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-not-faltas',
  templateUrl: './not-faltas.component.html',
  styleUrls: ['./not-faltas.component.css']
})
export class NotFaltasComponent implements OnInit,OnDestroy{


  detalleFaltas:DetalleFalta[]=[]
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
    this.notificacionService.obtenerFaltas()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (faltasInfo) => {
        if (faltasInfo) {
          this.cantidad = faltasInfo.faltas;
          this.detalleFaltas = faltasInfo.detalle_faltas;
        }
      }
    });
  }

  marcarLeido(falta:DetalleFalta){
    if(falta.leido===0){
      this.notificacionService.marcarLeido(falta.id)
    }
  }

}
