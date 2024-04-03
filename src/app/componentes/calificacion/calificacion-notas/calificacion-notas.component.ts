import { Subscription, take } from 'rxjs';
import { calificacion } from '../modelos/calificacion';
import { CalificarAlumno } from '../modelos/calificar_alumno';
import { instrumento_respuesta } from '../modelos/instrumento_respuesta';
import { CalificacionService } from './../calificacion.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionService } from 'src/app/otros/notificacion-popup/notificacionpopup.service';

@Component({
  selector: 'app-calificacion-notas',
  templateUrl: './calificacion-notas.component.html',
  styleUrls: ['./calificacion-notas.component.css']
})
export class CalificacionNotasComponent implements OnDestroy,OnInit {

  instrumentoRespuestaSuscripcion?:Subscription
  calificacionesSuscripcion?:Subscription

  instrumentoRespuesta?:instrumento_respuesta
  calificaciones:calificacion[]=[]
  calificarAlumnos:CalificarAlumno[]=[]


  constructor(private calificacionService:CalificacionService,
    private route:Router,
    private notificacionService:NotificacionService)
  {

  }

  ngOnInit(): void {
    this.suscripcionInstrumentoRespuesta()
  }

  ngOnDestroy(): void {
    this.calificacionService.limpiarInstrumentoRespuesta()
    this.instrumentoRespuestaSuscripcion?.unsubscribe()
    this.calificacionesSuscripcion?.unsubscribe()
  }

  private suscripcionInstrumentoRespuesta(){
    if(this.instrumentoRespuestaSuscripcion){
      this.instrumentoRespuestaSuscripcion.unsubscribe()
    }

    this.instrumentoRespuestaSuscripcion = this.calificacionService.suscripcionInstrumentoRespuesta().subscribe({
      next:(respuesta)=>{
        if(respuesta!=null){
          this.instrumentoRespuesta = respuesta
          this.mapearCalificarAlumnos()
          if(respuesta.id_escala!=1){
            this.suscribirseCalificaciones()
            this.obtenerCalificaciones(respuesta.id_escala)
          }
        }
      }
    })
  }

  private mapearCalificarAlumnos() {
    this.calificarAlumnos = this.instrumentoRespuesta!.alumnos.map(alumno => ({
      tipo_materia: this.instrumentoRespuesta!.tipo_materia,
      id_materia: this.instrumentoRespuesta!.id_materia,
      id_alumno: alumno.id,
      id_calificacion: null,
      id_operacion: this.instrumentoRespuesta?.id,
      observacion: "",
      alumno: alumno.apellido + ', ' + alumno.nombre,
      nuevaNota: alumno.id_calificacion || null,
      nuevaObservacion:alumno.observacion || "",
    } as CalificarAlumno)); // <-- Utilizando la interfaz
    this.ordenarCalificarAlumnos();
  }

  private ordenarCalificarAlumnos(){
    this.calificarAlumnos.sort((a, b) => {
      const nombreA = a.alumno.toUpperCase();
      const nombreB = b.alumno.toUpperCase();

      if (nombreA < nombreB) {
        return -1;
      } else if (nombreA > nombreB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  private suscribirseCalificaciones(){
    if(this.calificacionesSuscripcion){
      this.calificacionesSuscripcion.unsubscribe()
    }

    this.calificacionesSuscripcion = this.calificacionService.obtenerCalificaciones().subscribe({
      next:(respuesta)=>{
        this.calificaciones = respuesta
      }
    })
  }

  private obtenerCalificaciones(id_escala:number){
    this.calificacionService.buscarCalificaciones(id_escala)
  }

  validarNota(event: any, index:number) {
    const inputValue = event.target.value;
    if (inputValue < 1 || inputValue > 10) {
      this.calificarAlumnos[index].nuevaNota = this.calificarAlumnos[index].id_calificacion
    }else{
      if(this.calificarAlumnos[index].nuevaNota != this.calificarAlumnos[index].id_calificacion)
        this.enviarCalificacion(index)
    }
  }

  seleccionNota(index:number){
    if(this.calificarAlumnos[index].nuevaNota != this.calificarAlumnos[index].id_calificacion){
      this.enviarCalificacion(index)
    }

  }

  enviarObservacion(index:number){
    if(this.calificarAlumnos[index].nuevaObservacion != this.calificarAlumnos[index].observacion){
      this.enviarCalificacion(index)
    }
  }

  private calificacionSuscripcion?: Subscription;

  enviarCalificacion(index:number){
    if (this.calificacionSuscripcion) {
      this.calificacionSuscripcion.unsubscribe();
    }
    const alumnoCalificar = this.calificarAlumnos[index]
    this.calificacionSuscripcion = this.calificacionService.agregarCalificacion(alumnoCalificar).subscribe({
      next: (alumnoCalificado) => {
        if (alumnoCalificado) {
          this.calificarAlumnos[index] = alumnoCalificado;
        }
      }
    });
  }

  guardar(){
    this.notificacionService.establecerNotificacion('Exito','Calificaciones Guardadas')
    this.route.navigate(['dashboard','calificacion'])
  }
}
