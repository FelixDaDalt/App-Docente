import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { comunicado, comunicado_destinatario, comunicado_nuevo } from './comunicado';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { comunicado_enviado } from './comunicados-enviados/comunicado-enviado';
import { HomeService } from '../../componentes/home/home.service';


@Injectable({
  providedIn: 'root'
})
export class ComunicadosService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/comunicados';
  private apiDetalleteUrl = 'https://apiteach.geoeducacion.com.ar/api/detalle_comunicados';
  private comunicadoSubject = new BehaviorSubject<comunicado[] | []>([]);
  private comunicados:comunicado[]=[]
  private usuarioDatos!:usuarioDatos

  private comunicadoDestinatarioSubject= new BehaviorSubject<comunicado_destinatario[] | []>([]);
  private comunicadoDestinatario:comunicado_destinatario[]=[]

  private comunicadosEnviados:comunicado_enviado[]=[]
  private comunicadosEnviadosSubject= new BehaviorSubject<comunicado_enviado[] | []>([]);

  constructor(private http: HttpClient,
    usuarioDatosService:DatosUsuarioService,
    private homeService:HomeService) {

      usuarioDatosService.obtenerDatos().subscribe({
        next:(usuario)=>{
          if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
            this.usuarioDatos = usuario
            this.getComunicados()
          }
        }
      })
    }

    private getComunicados(){
      this.http.get<{ data: any }>(`${this.apiUrl}/show_comunicados/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }}).subscribe({
        next:(respuesta)=>{
          this.comunicados = respuesta.data
          this.emitirComunicados(this.comunicados)
        }
      })
    }

    private emitirComunicados(comunicados:comunicado[]){
      this.comunicadoSubject.next(comunicados)
    }

    private obtenerComunicados():Observable<comunicado[]|[]>{
      this.getComunicados()
      return this.comunicadoSubject.asObservable()
    }

    private leido(id_comunicado: number): Observable<{ data: any }> {
      return this.http.put<{ data: any }>(`${this.apiUrl}/lectura_comunicado/${this.usuarioDatos.ID_Institucion}`, { id_comunicado: id_comunicado });
    }

    obtenerTodos():Observable<comunicado[]|[]>{
      return this.obtenerComunicados()
    }

    obtenerNoLeidos():Observable<comunicado[]|[]>{
      return this.obtenerComunicados().pipe(
        map(comunicados => comunicados.filter(prop => prop.leido === 0))
      );
    }

    obtenerLeidos():Observable<comunicado[]|[]>{
      return this.obtenerComunicados().pipe(
        map(comunicados => comunicados.filter(prop => prop.leido === 1))
      );
    }


    marcarLeido(id_comunicado: number): void {
      this.leido(id_comunicado).subscribe({
        next: () => {
          const comunicados = this.actualizarEstadoLocal(id_comunicado);
          this.emitirComunicados(comunicados);
          this.homeService.actualizarNotificaciones()

        },
        error: (error) => {
          // Manejar errores si es necesario.
          console.error('Error al marcar como leído:', error);
        },
      });
    }

    private actualizarEstadoLocal(id_comunicado: number): comunicado[] {
      return this.comunicadoSubject.value.map(comunicado => {
        if (comunicado.id === id_comunicado) {
          comunicado.leido = 1;
        }
        return comunicado;
      });
    }

    private getDestinatarios() : void{
      const params = {
        id_usuario: this.usuarioDatos.ID_Usuario_Interno || 0,
        id_nivel: this.usuarioDatos.Rol_selected?.id_nivel || 0,
        rol: this.usuarioDatos.Rol_selected?.rol || "",
        id_curso:0,
        id_materia:0
      };

      this.http.get<{ data: any }>(`${this.apiDetalleteUrl}/lista_destinatarios/${this.usuarioDatos.ID_Institucion}`, { params })
        .subscribe({
          next: (respuesta) => {
            this.comunicadoDestinatario = respuesta.data;
            this.emitirComunicadosDestinatrios(this.comunicadoDestinatario);
          },
          error: (error) => {
            console.error('Error en getDestinatarios:', error);
          }
        });
    }

    private emitirComunicadosDestinatrios(comunicadoDestinatario:comunicado_destinatario[]){
      this.comunicadoDestinatarioSubject.next(comunicadoDestinatario)
    }

    obtenerDestinatarios():Observable<comunicado_destinatario[]|[]>{
      this.getDestinatarios()
      return this.comunicadoDestinatarioSubject.asObservable()
    }

    enviarComunicado(nuevoComunicado: any):Observable<any>{

      nuevoComunicado.id_nivel = this.usuarioDatos.Rol_selected?.id_nivel.toString()
      nuevoComunicado.id_usuario = this.usuarioDatos.ID_Usuario_Interno.toString()
      nuevoComunicado.rol = this.usuarioDatos.Rol_selected?.rol

      return this.postComunicado(nuevoComunicado).pipe(
        switchMap((respuesta: any) => {
          console.log(respuesta)
          if(nuevoComunicado.arr_adjuntos.length>0)
          {
            let adjuntos = {
              id_institucion:this.usuarioDatos.ID_Institucion,
              id_comunicado:respuesta,
              adjunto:nuevoComunicado.arr_adjuntos
            }
            if (this.usuarioDatos.ID_Institucion < 10) {
              return this.http.post<{ data: any }>('https://pesge.com.ar/conexiones/adjuntar_documentos.php', adjuntos);
            } else {
              return this.http.post<{ data: any }>('https://geoeducacion.com.ar/conexiones/adjuntar_documentos.php', adjuntos);
            }
          }else{
            return of(null);
          }

        })
      );
    }


    private postComunicado(nuevoComunicado:any) : Observable<number>{
      return this.http.post<{ data: any }>(`${this.apiDetalleteUrl}/nuevo_comunicado/${this.usuarioDatos.ID_Institucion}`, nuevoComunicado)
      .pipe(
        map((respuesta: any) => {
          const id = Number(respuesta.data.split(' - ')[0]);
          return id;
        })
      )
    }

    private getComunicadosEnviados(){
      this.http.get<{ data: any }>(`${this.apiDetalleteUrl}/lista_comunicados/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }}).subscribe({
        next:(respuesta)=>{
          this.comunicadosEnviados = respuesta.data.reverse()
          this.emitirComunicadosEnviados()
        }
      })
    }

    private emitirComunicadosEnviados(){
      this.comunicadosEnviadosSubject.next(this.comunicadosEnviados)
    }

    obtenerComunicadosEnviados():Observable<comunicado_enviado[]|[]>{
      this.getComunicadosEnviados()
      return this.comunicadosEnviadosSubject.asObservable()
    }

    borrarComunicado(idComunicado: number){
      this.http.put<{ data: any }>(`${this.apiDetalleteUrl}/borrar_comunicado/${this.usuarioDatos.ID_Institucion}?id_usuario=${this.usuarioDatos.ID_Usuario_Interno}&id_comunicado=${idComunicado}`, null).subscribe({
       next:(respuesta)=>{
          this.getComunicadosEnviados()
       },
       error:()=>{
         this.emitirComunicadosEnviados()
       }
      })
     }

}
