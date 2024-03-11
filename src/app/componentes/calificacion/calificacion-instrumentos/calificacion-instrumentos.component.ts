import { Component, OnDestroy, OnInit } from '@angular/core';
import { calificacion_instrumento } from './calificacion-instrumento';
import { CalificacionService } from '../calificacion.service';
import { HomeService } from '../../home/home.service';
import { materias } from '../../home/home';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calificacion-instrumentos',
  templateUrl: './calificacion-instrumentos.component.html',
  styleUrls: ['./calificacion-instrumentos.component.css']
})
export class CalificacionInstrumentosComponent implements OnInit,OnDestroy {

  materiasSuscripcion?:Subscription
  instrumentoSuscripcion?:Subscription

  instrumentos:calificacion_instrumento[]=[]
  materias:materias[]=[]
  materiaSel!:materias

  constructor(private calificacionService:CalificacionService,
    private homeService:HomeService,
    private router:Router){

  }

  ngOnInit(): void {
    this.suscripcionInstrumentos()
    this.suscripcionMaterias()
  }

  ngOnDestroy(): void {
    this.materiasSuscripcion?.unsubscribe()
    this.instrumentoSuscripcion?.unsubscribe()
  }


  private suscripcionInstrumentos(){
    if(this.instrumentoSuscripcion){
      this.instrumentoSuscripcion.unsubscribe()
    }

    this.instrumentoSuscripcion=this.calificacionService.suscripcionInstrumentos().subscribe({
      next:(calificacion_instrumento)=>{
        this.instrumentos = calificacion_instrumento
      }
    })
  }

  private suscripcionMaterias():void{
    if(this.materiasSuscripcion){
      this.materiasSuscripcion.unsubscribe()
    }

    this.materiasSuscripcion = this.homeService.suscribirseMaterias().subscribe({
      next:(materias)=>{
        if(materias.length>0){
          this.materias = materias
          this.materiaSel = this.materias[0]
          this.obtenerInstrumentos()
          this.materiasSuscripcion?.unsubscribe()
        }
      }
    })
  }

  obtenerInstrumentos(){
    this.calificacionService.obtenerInstrumentos(this.materiaSel.id,this.materiaSel.tipo_materia)
  }

  continuarCalificacion(id_operacion:number){
    this.calificacionService.continuarCalificacion(id_operacion,this.materiaSel.id,this.materiaSel.tipo_materia)
    this.router.navigate(['calificacion','calificacion-nuevo-instrumento','editar'])
  }

  nuevoInstrumento(){
    this.router.navigate(['calificacion','calificacion-nuevo-instrumento'])
  }
}
