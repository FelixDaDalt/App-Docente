import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetallePedagogico } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-not-pedagogicas',
  templateUrl: './not-pedagogicas.component.html',
  styleUrls: ['./not-pedagogicas.component.css']
})
export class NotPedagogicasComponent implements OnInit,OnDestroy{

  detallePedagogicas:DetallePedagogico[]=[]
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
    this.notificacionService.obtenerPedagogico()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
      next: (pedagogicasInfo) => {
        if (pedagogicasInfo) {
          this.cantidad = pedagogicasInfo.pedagogicas;
          this.detallePedagogicas = pedagogicasInfo.detalle_pedagogicos;
        }
      }
    });
  }

  marcarLeido(pedagogico:DetallePedagogico){
    if(pedagogico.leido===0){
      this.notificacionService.marcarLeido(pedagogico.id)
    }
  }
}
