import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { HomeService } from '../home/home.service';
import { libroTema, nuevo_registro, tipoClase } from './libro-tema';
import { BehaviorSubject, Observable } from 'rxjs';
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
            this.getTiposClases()
          }
        }
      })

    }

    private getTiposClases(){
      this.http.get<{ data: any }>(`${this.apiUrl}/lista_tipo_clases/${this.usuarioDatos.ID_Institucion}`, {params: { id_nivel: this.usuarioDatos.Rol_selected?.id_nivel || -1 }}).subscribe({
        next:(respuesta)=>{
          this.tiposClases = respuesta.data
          this.emitirTiposClases(this.tiposClases)
        }
      })
    }

    private emitirTiposClases(tiposClases:tipoClase[]){
      this.tiposClasesSubject.next(tiposClases)
    }

    obtenerTiposClases():Observable<tipoClase[]|[]>{
      this.getTiposClases()
      return this.tiposClasesSubject.asObservable()
    }

    private getRegistros(materia:materias){
      this.http.get<{ data: any }>(`${this.apiUrl}/registros_libro_temas/${this.usuarioDatos.ID_Institucion}`, {params: { id_materia: materia.id, tipo_materia:materia.tipo_materia }}).subscribe({
        next:(respuesta)=>{
          this.registros = respuesta.data
          this.emitirRegistros(this.registros)
        }
      })
    }

    private emitirRegistros(registros:libroTema[]){
      this.registrosSubject.next(registros)
    }

    obtenerRegistros(materia:materias):Observable<libroTema[]|[]>{
      this.registrosSubject.next([]) ////????
      this.getRegistros(materia)
      return this.registrosSubject.asObservable()
    }

    private postRegistro(registro: nuevo_registro) : Observable<any>{
      return this.http.post<{ data: any }>(`${this.apiUrl}/agregar_registro_libro_temas/${this.usuarioDatos.ID_Institucion}`, registro)
    }

    agregarRegistro(nuevoRegistro:nuevo_registro){
      this.postRegistro(nuevoRegistro).subscribe({
        next:(respuesta)=>{
          this.getRegistros(nuevoRegistro!.materia!)
        }
      })
    }

}
