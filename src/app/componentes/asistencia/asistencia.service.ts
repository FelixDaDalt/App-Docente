import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap} from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { Asistencia, Parte_Asistencia, parte } from './asistencia';
import { materias } from '../home/home';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/asistencias'
  private usuarioDatos!:usuarioDatos


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

  // OK
  obtenerAsistencias(fecha:string):Observable<Asistencia[]>{
    return this.http.get<{ data: any }>(`${this.apiUrl}/alumnos_materias/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno, fecha:fecha}})
    .pipe(
      map(respuesta => respuesta.data)
    )
  }


  // OK
  agregarAsistencias(parteAsistencia:Parte_Asistencia):Observable<any>{
    return this.http.post<{ data: any }>(`${this.apiUrl}/nuevo_parte_asistencia/${this.usuarioDatos.ID_Institucion}`, { ...{ id_usuario: this.usuarioDatos.ID_Usuario_Interno }, ...parteAsistencia.toJSON() })
  }

  // Ok
  obtenerPartesPorMateria(materia:materias):Observable<parte[]>{
    return this.http.get<{ data: any }>(`${this.apiUrl}/lista_partes/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno, id_materia:materia.id, tipo_materia:materia.tipo_materia}})
    .pipe(
      map(respuesta => respuesta.data)
    )
  }

}
