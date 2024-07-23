import { Component, OnDestroy, OnInit } from '@angular/core';
import { calificacion_instrumento } from './calificacion-instrumento';
import { CalificacionService } from '../calificacion.service';
import { HomeService } from '../../home/home.service';
import { materias } from '../../home/home';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of, tap } from 'rxjs';

@Component({
  selector: 'app-calificacion-instrumentos',
  templateUrl: './calificacion-instrumentos.component.html',
  styleUrls: ['./calificacion-instrumentos.component.css']
})
export class CalificacionInstrumentosComponent implements OnInit,OnDestroy {

  materiasSuscripcion?:Subscription
  instrumentoSuscripcion?:Subscription

  instrumentos$:Observable<calificacion_instrumento[]>=of([])
  materias$:Observable<materias[]>=of([])

  materiaSel!:materias
  idMateria?:string | number
  constructor(private calificacionService:CalificacionService,
    private homeService:HomeService,
    private router:Router,
    private route: ActivatedRoute){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params)
        this.idMateria = params['id'];
    });

    this.materiasSuscripcion = this.obtenerMaterias().subscribe({
      next:(r)=>{
        if(this.materiaSel)
          this.obtenerInstrumentos()
      }
    })
  }

  ngOnDestroy(): void {
    this.materiasSuscripcion?.unsubscribe()
    this.instrumentoSuscripcion?.unsubscribe()
  }



  private obtenerMaterias(){
    return this.homeService.suscribirseMaterias()
    .pipe(
      tap(
        materias =>{
            this.materiaSel = materias.find(materia => materia.id == this.idMateria) || materias[0]
            this.materias$ = of(materias)
          }
        )
      )
  }

  obtenerInstrumentos(){
    this.instrumentoSuscripcion = this.calificacionService.obtenerInstrumentos(this.materiaSel.id,this.materiaSel.tipo_materia)
    .pipe(
      tap(instrumentos => this.instrumentos$ = of(instrumentos))
    ).subscribe()
  }


  continuarCalificacion(id_operacion:number){
    this.router.navigate(['dashboard','calificacion','calificacion-notas',this.materiaSel.id,this.materiaSel.tipo_materia,id_operacion])
  }

  nuevoInstrumento(){
    this.router.navigate(['dashboard','calificacion','calificacion-nuevo-instrumento',this.materiaSel.id])
  }
}
