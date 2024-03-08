import { HomeService } from 'src/app/componentes/home/home.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { materias } from '../../home/home';
import { tipo_calificacion } from '../modelos/tipo_calificacion';
import { CalificacionService } from '../calificacion.service';
import { escala } from '../modelos/escala';
import { calificacion } from '../modelos/calificacion';
import { instrumento } from '../modelos/instrumento';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit, OnDestroy{

  materiasSuscripcion?:Subscription
  tipoCalificacionesSuscripcion?:Subscription
  listaEscalasSuscripcion?:Subscription
  calificacionSuscripcion?:Subscription
  instrumentoRespuestaSuscripcion?:Subscription

  materias:materias[]=[]
  tiposCalificaciones:tipo_calificacion[]=[]
  listaEscalas:escala[]=[]
  calificaciones:calificacion[]=[]

  materiaSel: materias | null = null;
  calificacionSel:tipo_calificacion | null = null
  escalaSel:escala | null= null
  promediableValue=false;


  constructor(private homeService:HomeService,
    private calificacionService:CalificacionService,
    private route:Router,
    private router: ActivatedRoute){
  }

  ngOnDestroy(): void {
    this.materiasSuscripcion?.unsubscribe()
    this.tipoCalificacionesSuscripcion?.unsubscribe()
    this.listaEscalasSuscripcion?.unsubscribe()
    this.calificacionSuscripcion?.unsubscribe()
    this.instrumentoRespuestaSuscripcion?.unsubscribe()
  }

  ngOnInit(): void {
    this.obtenerMaterias()
    this.suscribirseTipoCalificaciones()
    this.suscribirseListaEscalas()
    this.suscribirseCalificacion()
    this.suscribirseInstrumentoRespuesta()

    this.router.params.subscribe(params => {
      const editParam = params['edit'];
      if (editParam=='editar') {
        this.suscribirseInstrumentoRespuesta()
      }
    });
  }

  private obtenerMaterias():void{
    if(this.materiasSuscripcion){
      this.materiasSuscripcion.unsubscribe()
    }

    this.materiasSuscripcion = this.homeService.obtenerMateriasAsignadas().subscribe({
      next:(materias)=>{
        if(materias){
          this.materias = materias
          this.materiaSel = materias[0]
          this.buscarTiposCalificacionesyEscalas()
        }
      }
    })
  }

  private suscribirseTipoCalificaciones(){
    if(this.tipoCalificacionesSuscripcion){
      this.tipoCalificacionesSuscripcion?.unsubscribe()
    }

    this.tipoCalificacionesSuscripcion = this.calificacionService.obtenerTiposCalificacion().subscribe({
      next:(tiposCalificacion)=>{
        this.tiposCalificaciones = tiposCalificacion
      }
    })
  }

  private suscribirseListaEscalas(){
    if(this.listaEscalasSuscripcion){
      this.listaEscalasSuscripcion.unsubscribe()
    }

    this.listaEscalasSuscripcion = this.calificacionService.obtenerListaEscalas().subscribe({
      next:(listaEscalas)=>{
        this.listaEscalas = listaEscalas
      }
    })
  }

  private suscribirseCalificacion(){
    if(this.calificacionSuscripcion){
      this.calificacionSuscripcion.unsubscribe()
    }

    this.calificacionSuscripcion = this.calificacionService.obtenerCalificaciones().subscribe({
      next:(calificaciones)=>{
        this.calificaciones = calificaciones
      }
    })
  }

  buscarTiposCalificacionesyEscalas(){
    if(this.materiaSel){
      this.calificacionService.buscarTiposCalificacion(this.materiaSel.id)
      this.calificacionService.buscarListaEscalas(this.materiaSel.id)
    }
  }

  suscribirseInstrumentoRespuesta(){
    if(this.instrumentoRespuestaSuscripcion){
      this.instrumentoRespuestaSuscripcion.unsubscribe()
    }

   this.instrumentoRespuestaSuscripcion = this.calificacionService.suscripcionInstrumentoRespuesta().subscribe({
      next:(instrumento_respuesta)=>{
        if(instrumento_respuesta!=null)
        this.route.navigate(['/calificacion-notas']);
      }
    })
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
      this.calificacionService.enviarInstrumento(instrumento)
      this.suscribirseInstrumentoRespuesta()
    }

  }



}
