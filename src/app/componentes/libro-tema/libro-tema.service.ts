import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { HomeService } from '../home/home.service';
import { libroTema, nuevo_registro, tipoClase } from './libro-tema';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { materias } from '../home/home';

@Injectable({
  providedIn: 'root'
})

export class LibroTemaService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/libro_temas';
  private usuarioDatos!:usuarioDatos
  private registros:libroTema[]=[]
  private registrosSubject = new BehaviorSubject<libroTema[] | []>([]);
  private tiposClases:tipoClase[]=[]
  private tiposClasesSubject = new BehaviorSubject<tipoClase[] | []>([]);

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

    //Ok
    obtenerTiposClases():Observable<tipoClase[]>{
      return this.http.get<{ data: any }>(`${this.apiUrl}/lista_tipo_clases/${this.usuarioDatos.ID_Institucion}`)
      .pipe(
        map(respuesta=>respuesta.data)
      )
    }

    //Ok
    obtenerRegistros(materia:materias):Observable<libroTema[]|[]>{
      return this.http.get<{ data: any }>(`${this.apiUrl}/registros_libro_temas/${this.usuarioDatos.ID_Institucion}`, {params: { id_materia: materia.id, tipo_materia:materia.tipo_materia }})
      .pipe(
        map(respuesta => respuesta.data)
      )
    }

    //Ok
    agregarRegistro(registro:nuevo_registro){
      return this.http.post<{ data: any }>(`${this.apiUrl}/agregar_registro_libro_temas/${this.usuarioDatos.ID_Institucion}`, registro)
    }

}
