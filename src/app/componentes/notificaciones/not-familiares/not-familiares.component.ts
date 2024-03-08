import { Component } from '@angular/core';
import { DetalleFamiliar } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-not-familiares',
  templateUrl: './not-familiares.component.html',
  styleUrls: ['./not-familiares.component.css']
})
export class NotFamiliaresComponent {
  detalleFamiliar:DetalleFamiliar[]=[]
  cantidad:number=0
  private ngUnsubscribe=new Subject()

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
    this.notificacionService.obtenerFamiliares()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (familiarInfo) => {
        if (familiarInfo) {
          this.cantidad = familiarInfo.familiares;
          this.detalleFamiliar = familiarInfo.detalle_familiares;
        }
      }
    });
  }

  marcarLeido(familiar:DetalleFamiliar){
    if(familiar.leido===0){
      this.notificacionService.marcarLeido(familiar.id)
    }
  }
}
