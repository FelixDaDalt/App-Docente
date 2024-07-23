import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tutoriales } from './tutoriales';
import { Observable, map, tap } from 'rxjs';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';

@Injectable({
  providedIn: 'root'
})
export class TutorialesService {

  usuarioDatos!:usuarioDatos

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/home/';

  constructor(private httpClient:HttpClient, usuarioDatosService:DatosUsuarioService) {

    usuarioDatosService.obtenerDatos().subscribe({
      next:(usuario:any)=>{
        if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
          this.usuarioDatos = usuario
        }
      }
    })
  }

  obtenerTutoriales() : Observable<tutoriales[]>{
    return this.httpClient.get<any>(`${this.apiUrl}tutoriales/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno}})
    .pipe(
      map(respuesta => respuesta.data)
    );
  }
}
