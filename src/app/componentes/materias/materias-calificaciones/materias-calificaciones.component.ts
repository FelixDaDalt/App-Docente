import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, of, tap } from 'rxjs';
import { calificacion_instrumento } from '../../calificacion/calificacion-instrumentos/calificacion-instrumento';
import { materias } from '../../home/home';
import { CalificacionService } from '../../calificacion/calificacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materias-calificaciones',
  templateUrl: './materias-calificaciones.component.html',
  styleUrls: ['./materias-calificaciones.component.css']
})
export class MateriasCalificacionesComponent implements OnInit,OnDestroy{
  private suscriberInstrumentos?:Subscription
  private suscriberMateria?:Subscription

  instrumentos$:Observable<calificacion_instrumento[]>=of([])
  @Input() materia:Observable<materias | null> = of(null)


  constructor(private calificacionService:CalificacionService,
    private router:Router){

  }

  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe()
    this.suscriberInstrumentos?.unsubscribe()


  }

  ngOnInit(): void {
    this.suscriberMateria = this.materia.subscribe({
      next:(materia)=>{
        if(materia)
        {
          this.suscriberInstrumentos = this.suscripcionInstrumentos(materia).subscribe()
          this.obtenerInstrumentos(materia)
        }
      }
    })
  }


  private suscripcionInstrumentos(materia:materias){
      return this.calificacionService.obtenerInstrumentos(materia.id,materia.tipo_materia)
      .pipe(
        tap(instrumentos => this.instrumentos$ = of(instrumentos))
      )
  }

  private obtenerInstrumentos(materia:materias){
    if(materia.tipo_materia!='Z')
      this.calificacionService.obtenerInstrumentos(materia.id, materia.tipo_materia)
  }

  continuarCalificacion(id_operacion: number) {
    const suscripcion = this.materia?.subscribe(materia => {
        if (materia) {
            this.router.navigate(['dashboard','calificacion','calificacion-notas',materia.id,materia.tipo_materia,id_operacion])
        }
    });
}

}
