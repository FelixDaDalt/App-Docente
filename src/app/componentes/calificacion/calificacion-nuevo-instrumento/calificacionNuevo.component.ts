import { HomeService } from 'src/app/componentes/home/home.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { materias } from '../../home/home';
import { tipo_calificacion } from '../modelos/tipo_calificacion';
import { CalificacionService } from '../calificacion.service';
import { escala } from '../modelos/escala';
import { calificacion } from '../modelos/calificacion';
import { instrumento } from '../modelos/instrumento';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of, tap } from 'rxjs';

@Component({
  selector: 'app-calificacionNuevo',
  templateUrl: './calificacionNuevo.component.html',
  styleUrls: ['./calificacionNuevo.component.css']
})
export class CalificacionNuevoComponent implements OnInit, OnDestroy{

  materiasSuscripcion?:Subscription
  tipoCalificacionesSuscripcion?:Subscription
  listaEscalasSuscripcion?:Subscription
  calificacionSuscripcion?:Subscription
  instrumentoRespuestaSuscripcion?:Subscription

  materias$:Observable<materias[]>=of([])

  tiposCalificaciones$:Observable<tipo_calificacion[]>=of([])
  listaEscalas$:Observable<escala[]>=of([])
  calificaciones$:Observable<calificacion[]>=of([])

  materiaSel: materias | null = null;
  calificacionSel:tipo_calificacion | null = null
  escalaSel:escala | null= null
  promediableValue=false;

  idMateria?:number


  constructor(private homeService:HomeService,
    private calificacionService:CalificacionService,
    private route:Router,
    private router: ActivatedRoute){
      this.router.params.subscribe(params => {
        if(params)
          this.idMateria = params['id'];
      });
    }

  ngOnDestroy(): void {
    this.materiasSuscripcion?.unsubscribe()
    this.tipoCalificacionesSuscripcion?.unsubscribe()
    this.listaEscalasSuscripcion?.unsubscribe()
    this.calificacionSuscripcion?.unsubscribe()
    this.instrumentoRespuestaSuscripcion?.unsubscribe()
  }

  ngOnInit(): void {
    this.materiasSuscripcion = this.obtenerMaterias().subscribe({
      next:()=>{
      this.buscarTiposCalificacionesyEscalas()}
    })
    this.listaEscalasSuscripcion = this.suscribirseTipoCalificaciones().subscribe()
    this.listaEscalasSuscripcion = this.suscribirseListaEscalas().subscribe()
    this.calificacionSuscripcion = this.suscribirseCalificacion().subscribe()
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



  private suscribirseTipoCalificaciones(){
    return this.calificacionService.obtenerTiposCalificacion()
    .pipe(
      tap(tiposCalificacion=> this.tiposCalificaciones$ = of(tiposCalificacion))
    )
  }

  private suscribirseListaEscalas(){
    return this.calificacionService.obtenerListaEscalas().pipe(
      tap(listaEscalas => this.listaEscalas$ = of(listaEscalas))
    )
  }

  private suscribirseCalificacion(){
    return this.calificacionService.obtenerCalificaciones().pipe(
      tap(calificaciones => this.calificaciones$ = of(calificaciones))
    )
  }

  buscarTiposCalificacionesyEscalas(){
    if(this.materiaSel){
      this.calificacionService.buscarTiposCalificacion(this.materiaSel.id)
      this.calificacionService.buscarListaEscalas(this.materiaSel.id)
    }
  }

  enviarInstrumento(titulo:string){
    if(this.materiaSel && this.escalaSel && this.calificacionSel)
    {
      const instrumento:instrumento = {
        id_materia:this.materiaSel.id,
        tipo_materia:this.materiaSel.tipo_materia,
        descripcion:titulo,
        escala:this.escalaSel.id,
        promediable:this.promediableValue===true?1:0,
        id_calificacion:this.calificacionSel.id
      }
      this.calificacionService.enviarInstrumento(instrumento).subscribe({
        next:(respuesta)=>{
          if(respuesta){
            this.route.navigate(['dashboard','calificacion','calificacion-notas',respuesta.id_materia, respuesta.tipo_materia, respuesta.id])
          }
        }
      })
    }

  }



}
