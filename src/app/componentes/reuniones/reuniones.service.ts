import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { nueva_Reunion, reunion } from './reunion';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { reprogramar } from './reagendar-reunion/reagendar-reunion.component';

@Injectable({
  providedIn: 'root'
})
export class ReunionesService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/detalle_comunicados';
  private usuarioDatos!:usuarioDatos

  private reunionSubject = new BehaviorSubject<reunion[] | []>([]);
  private reuniones:reunion[]=[]


  constructor(private httpClient:HttpClient,usuarioDatosService:DatosUsuarioService) {
    usuarioDatosService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
          this.usuarioDatos = usuario
        }
      }
    })
  }

  //OK
  obtenerReuniones():Observable<reunion[]>{
    return this.httpClient.get<{ data: any }>(`${this.apiUrl}/lista_solicitudes_reunion/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno}})
    .pipe(
      map(respuesta => respuesta.data)
    )
  }

  //OK
  enviarReunion(nuevaReunion: nueva_Reunion):Observable<any>{
    nuevaReunion.id_nivel = this.usuarioDatos.Rol_selected!.id_nivel.toString()
    nuevaReunion.id_usuario = this.usuarioDatos.ID_Usuario_Interno.toString()
    nuevaReunion.rol = this.usuarioDatos.Rol_selected!.rol
    return this.httpClient.post<{ data: any }>(`${this.apiUrl}/nueva_solicitud_reunion/${this.usuarioDatos.ID_Institucion}`, nuevaReunion)
  }


  //OK
  getTextoPredeterminado(){
    return this.httpClient.get<{ data: any }>(`${this.apiUrl}/texto_predeterminado/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno}})
    .pipe(map(respuesta => respuesta.data))
  }

  //OK
  reprogramar(reprogramar:reprogramar){
    reprogramar = {...reprogramar, id_usuario:this.usuarioDatos.ID_Usuario_Interno}
    return this.httpClient.post<{ data: any }>(`${this.apiUrl}/reagendar_solicitud_reunion/${this.usuarioDatos.ID_Institucion}`, reprogramar)
  }

}
