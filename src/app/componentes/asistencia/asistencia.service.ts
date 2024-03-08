import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { Asistencia, Parte_Asistencia, parte } from './asistencia';
import { materias } from '../home/home';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/asistencias'
  private asistenciaSubject = new BehaviorSubject<Asistencia[] | []>([]);
  private asistencias:Asistencia[]=[]
  private usuarioDatos!:usuarioDatos

  private partes$ = new BehaviorSubject<parte[] | []>([]);

  constructor(private http: HttpClient,
    usuarioDatosService:DatosUsuarioService) {

      usuarioDatosService.obtenerDatos().subscribe({
        next:(usuario)=>{
          if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
            this.usuarioDatos = usuario
          }
        }
      })
    }


  private getAsistencias(fecha:string){
    this.http.get<{ data: any }>(`${this.apiUrl}/alumnos_materias/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno, rol:this.usuarioDatos.Rol_selected!.rol, fecha:fecha, id_nivel:this.usuarioDatos.Rol_selected!.id_nivel}}).subscribe({
      next:(respuesta)=>{
        this.asistencias = respuesta.data
        this.emitirAsistencia()
      }
    })
  }


  private emitirAsistencia(){
    this.asistenciaSubject.next(this.asistencias)
  }

  obtenerAsistencias(fecha:string){
    this.getAsistencias(fecha)
  }

  suscribirseAsistencia(){
    return this.asistenciaSubject.asObservable()
  }

  postAsistencias(parteAsistencia:Parte_Asistencia){
    console.log(parteAsistencia)
    this.http.post<{ data: any }>(`${this.apiUrl}/nuevo_parte_asistencia/${this.usuarioDatos.ID_Institucion}`, { ...{ id_usuario: this.usuarioDatos.ID_Usuario_Interno }, ...parteAsistencia.toJSON() }).subscribe({
      next:(respuesta)=>{
        console.log(respuesta)
        this.getAsistencias(parteAsistencia.fecha)
      }
    })
  }

  private getPartesPorMateria(materia:materias){
    this.http.get<{ data: any }>(`${this.apiUrl}/lista_partes/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno, rol:this.usuarioDatos.Rol_selected!.rol, id_nivel:this.usuarioDatos.Rol_selected!.id_nivel, id_materia:materia.id, tipo_materia:materia.tipo_materia}}).subscribe({
      next:(respuesta)=>{
        this.emitirPartes(respuesta.data)
      }
    })
  }

  private emitirPartes(parte:parte[]){
    this.partes$.next(parte)
  }

  suscripcionParte(){
    return this.partes$.asObservable()
  }

  obtenerPartes(materia:materias){
    this.getPartesPorMateria(materia)
  }

  buscarAsistencia(id:number, fecha:string){
    this.getAsistencias(fecha)
  }

}
