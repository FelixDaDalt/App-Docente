import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { tipo_calificacion } from './modelos/tipo_calificacion';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { escala } from './modelos/escala';
import { calificacion } from './modelos/calificacion';
import { instrumento } from './modelos/instrumento';
import { instrumento_respuesta } from './modelos/instrumento_respuesta';
import { CalificarAlumno } from './modelos/calificar_alumno';
import { calificacion_instrumento } from './calificacion-instrumentos/calificacion-instrumento';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/calificacion';
  private usuarioDatos!:usuarioDatos

  private tipoCalificacion$ = new BehaviorSubject<tipo_calificacion[]>([])
  private escala$ = new BehaviorSubject<escala[]>([])
  private calificacion$ = new BehaviorSubject<calificacion[]>([])
  private instrumentoRespuesta$ = new BehaviorSubject<instrumento_respuesta | null>(null);
  private instrumentoRespuesta!:instrumento_respuesta | null

  private alumnoCalificado$ = new BehaviorSubject<CalificarAlumno | null>(null);
  private instrumentos$ = new BehaviorSubject<calificacion_instrumento[]>([])

  constructor(private http: HttpClient,usuarioDatosService:DatosUsuarioService) {
    usuarioDatosService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
          this.usuarioDatos = usuario
        }
      }
    })
   }

  private getTiposCalificacion(idMateria:number){
    this.http.get<{ data: any }>(`${this.apiUrl}/lista_tipo_calificaciones/${this.usuarioDatos.ID_Institucion}`, {params: { id_materia: idMateria }}).subscribe({
      next:(respuesta)=>{
        this.emitirTiposCalificacion(respuesta.data)
      }
    })
  }

  private getListaEscalas(idMateria:number){
    this.http.get<{ data: any }>(`${this.apiUrl}/lista_escalas/${this.usuarioDatos.ID_Institucion}`, {params: { id_materia: idMateria }}).subscribe({
      next:(respuesta)=>{
        this.emitirListaEscalas(respuesta.data)
      }
    })
  }

  private getListaCalificaciones(idEscala:number){
    this.http.get<{ data: any }>(`${this.apiUrl}/lista_calificaciones/${this.usuarioDatos.ID_Institucion}`, {params: { id_escala: idEscala }}).subscribe({
      next:(respuesta)=>{
        this.emitirCalificaciones(respuesta.data)
      }
    })
  }


  private postInstrumento(instrumento:instrumento){
    this.http.post<{ data: any }>(`${this.apiUrl}/agregar_nuevo_instrumento/${this.usuarioDatos.ID_Institucion}`,instrumento).subscribe({
      next:(respuesta)=>{
        this.instrumentoRespuesta = respuesta.data
        this.emitirInstrumentoRespuesta()
      }
    })
  }

  private emitirInstrumentoRespuesta(){
    this.instrumentoRespuesta$.next(this.instrumentoRespuesta)
  }

  private emitirListaEscalas(listaEscalas:escala[]){
    this.escala$.next(listaEscalas)
  }

  private emitirTiposCalificacion(tiposCalificacion:tipo_calificacion[]){
    this.tipoCalificacion$.next(tiposCalificacion)
  }

  private emitirCalificaciones(calificacion:calificacion[]){
    this.calificacion$.next(calificacion)
  }



  buscarListaEscalas(idMateria:number){
    this.getListaEscalas(idMateria)
  }

  buscarTiposCalificacion(idMateria:number){
    this.getTiposCalificacion(idMateria)
  }

  buscarCalificaciones(idEscala:number){
    this.getListaCalificaciones(idEscala)
  }

  obtenerTiposCalificacion(){
    return this.tipoCalificacion$.asObservable()
  }

  obtenerListaEscalas(){
    return this.escala$.asObservable()
  }

  obtenerCalificaciones(){
    return this.calificacion$.asObservable()
  }

  enviarInstrumento(instrumento:instrumento){
    instrumento.id_usuario = this.usuarioDatos.ID_Usuario_Interno
    this.postInstrumento(instrumento)
  }

  suscripcionInstrumentoRespuesta(){
    return this.instrumentoRespuesta$.asObservable()
  }

  continuarCalificacion(id_operacion:number, id_materia:number, tipo_materia:string){
    this.editInstrumento(id_operacion,id_materia,tipo_materia)
  }

  limpiarInstrumentoRespuesta(){
    this.instrumentoRespuesta$.next(null)
  }

  private editInstrumento(id_operacion:number, id_materia:number, tipo_materia:string){
    this.http.get<{ data: any }>(`${this.apiUrl}/lista_calificados/${this.usuarioDatos.ID_Institucion}`, {params: {id_operacion:id_operacion, id_materia: id_materia, tipo_materia:tipo_materia }}).subscribe({
      next:(respuesta)=>{
        this.instrumentoRespuesta = respuesta.data
        this.emitirInstrumentoRespuesta()
      }
    })
  }


  private postCalificacion(calificarAlumno:CalificarAlumno){
    this.http.post<any>(`${this.apiUrl}/agregar_editar_calificacion_alumno/${this.usuarioDatos.ID_Institucion}`,calificarAlumno).subscribe({
      next:(respuesta)=>{
        if(respuesta.success == true){
          calificarAlumno.id_calificacion = respuesta.data.id_calificacion
          calificarAlumno.nuevaNota = respuesta.data.id_calificacion
          calificarAlumno.nuevaObservacion = respuesta.data.observacion
          this.emitirAlumnoCalificado(calificarAlumno)
        }
      }
    })
  }

  private emitirAlumnoCalificado(calificarAlumno:CalificarAlumno){
    this.alumnoCalificado$.next(calificarAlumno)
  }

  agregarCalificacion(calificarAlumno:CalificarAlumno){
    this.alumnoCalificado$.next(calificarAlumno)
    calificarAlumno.id_usuario = this.usuarioDatos.ID_Usuario_Interno
    calificarAlumno.id_calificacion = calificarAlumno.nuevaNota!
    calificarAlumno.observacion = calificarAlumno.nuevaObservacion!
    delete calificarAlumno.nuevaNota
    delete calificarAlumno.nuevaObservacion
    this.postCalificacion(calificarAlumno)
    return this.alumnoCalificado$.asObservable()
  }


  private emitirInstrumentos(instrumentos:calificacion_instrumento[]){
    this.instrumentos$.next(instrumentos)
  }

  private getInstrumentos(idMateria:number, tipo_materia:string){
    this.http.get<{ data: any }>(`${this.apiUrl}/lista_instrumentos_materia/${this.usuarioDatos.ID_Institucion}`, {params: { id_materia: idMateria, tipo_materia:tipo_materia }}).subscribe({
      next:(respuesta)=>{
        this.emitirInstrumentos(respuesta.data)
      }
    })
  }

  obtenerInstrumentos(idMateria:number, tipo_materia:string){
    this.getInstrumentos(idMateria, tipo_materia)
  }

  suscripcionInstrumentos(){
    return this.instrumentos$.asObservable()
  }

}
