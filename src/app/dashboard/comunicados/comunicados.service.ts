import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { comunicado, comunicado_destinatario, comunicado_nuevo } from './comunicado';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { comunicado_enviado } from './comunicados-enviados/comunicado-enviado';
import { HomeService } from '../../componentes/home/home.service';


@Injectable({
  providedIn: 'root'
})
export class ComunicadosService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/comunicados';
  private apiDetalleteUrl = 'https://apiteach.geoeducacion.com.ar/api/detalle_comunicados';

  private usuarioDatos!:usuarioDatos

  constructor(private http: HttpClient,
    usuarioDatosService:DatosUsuarioService,
    private homeService:HomeService) {

      usuarioDatosService.obtenerDatos().subscribe({
        next:(usuario)=>{
          if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
            this.usuarioDatos = usuario

          }
        }
      })
    }


    //ok
    private leido(id_comunicado: number): Observable<{ data: any }> {
      return this.http.put<{ data: any }>(`${this.apiUrl}/lectura_comunicado/${this.usuarioDatos.ID_Institucion}`, { id_comunicado: id_comunicado });
    }

    //Ok
    obtenerTodos():Observable<comunicado[]>{
      return this.http.get<{ data: any }>(`${this.apiUrl}/show_comunicados/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }})
      .pipe(
        map(respuesta=>respuesta.data)
      )
    }

    //Ok
    obtenerNoLeidos():Observable<comunicado[]>{
      return this.http.get<{ data: any }>(`${this.apiUrl}/show_comunicados/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }})
      .pipe(
        map(respuesta=>respuesta.data),
        map((comunicados:comunicado[])=>comunicados.filter(comunicado=>comunicado.leido===0))
      )
    }
    //Ok
    obtenerLeidos():Observable<comunicado[]|[]>{
      return this.http.get<{ data: any }>(`${this.apiUrl}/show_comunicados/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }})
      .pipe(
        map(respuesta=>respuesta.data),
        map((comunicados:comunicado[])=>comunicados.filter(comunicado=>comunicado.leido===1))
      )
    }
    //ok
    marcarLeido(id_comunicado: number): Observable<{}> {
      return this.leido(id_comunicado).pipe(
        switchMap(() => {
          this.homeService.actualizarNotificaciones();
          return of({})
        })
      );
    }


    //ok
    obtenerDestinatarios():Observable<comunicado_destinatario[]>{
      const params = {
        id_usuario: this.usuarioDatos.ID_Usuario_Interno || 0,
        id_nivel: this.usuarioDatos.Rol_selected?.id_nivel || 0,
        rol: this.usuarioDatos.Rol_selected?.rol || "",
        id_curso:0,
        id_materia:0
      };
      return this.http.get<{ data: any }>(`${this.apiDetalleteUrl}/lista_destinatarios/${this.usuarioDatos.ID_Institucion}`, { params })
      .pipe(
        map(respuesta=>respuesta.data)
      )
    }


    //OK
    enviarComunicado(nuevoComunicado: any):Observable<any>{
      nuevoComunicado.id_nivel = this.usuarioDatos.Rol_selected?.id_nivel.toString()
      nuevoComunicado.id_usuario = this.usuarioDatos.ID_Usuario_Interno.toString()
      nuevoComunicado.rol = this.usuarioDatos.Rol_selected?.rol

      return this.postComunicado(nuevoComunicado)
    }

    //OK
    private postComunicado(nuevoComunicado: any): Observable<number> {
      const apiUrl = this.usuarioDatos.ID_Institucion < 10 ? 'https://pesge.com.ar/conexiones/adjuntar_documentos.php' : 'https://geoeducacion.com.ar/conexiones/adjuntar_documentos.php';

      return this.http.post<{ data: any }>(`${this.apiDetalleteUrl}/nuevo_comunicado/${this.usuarioDatos.ID_Institucion}`, nuevoComunicado).pipe(
        tap((respuesta: any) => Number(respuesta.data.split(' - ')[0])),
        tap((idComunicado: number) => {
          if (nuevoComunicado.arr_adjuntos.length > 0) {
            const adjuntos = {
              id_institucion: this.usuarioDatos.ID_Institucion,
              id_comunicado: idComunicado,
              adjunto: nuevoComunicado.arr_adjuntos
            };
            return this.adjuntarDocumentos(apiUrl, adjuntos);
          } else {
            return of(null);
          }
        })
      );
    }

    //OK
    private adjuntarDocumentos(apiUrl: string, adjuntos: any): Observable<any> {
      return this.http.post<{ data: any }>(apiUrl, adjuntos);
    }

    //OK
    obtenerComunicadosEnviados():Observable<comunicado_enviado[]>{
      return this.http.get<{ data: any }>(`${this.apiDetalleteUrl}/lista_comunicados/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }})
      .pipe(
        map(respuesta=>respuesta.data),
        map((comunicadosEnviados:comunicado_enviado[])=>comunicadosEnviados.reverse())
      )
    }

    //OK
    borrarComunicado(idComunicado: number):Observable<any>{
      return this.http.put<{ data: any }>(`${this.apiDetalleteUrl}/borrar_comunicado/${this.usuarioDatos.ID_Institucion}?id_usuario=${this.usuarioDatos.ID_Usuario_Interno}&id_comunicado=${idComunicado}`, null)
    }

}
