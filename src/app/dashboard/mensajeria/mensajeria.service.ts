import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, Subscription } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { mensajeria, mensajeria_historial, nuevoChat } from './mensajeria';
import { destinatario } from './destinatarios/destinatario';

@Injectable({
  providedIn: 'root'
})
export class MensajeriaService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/mensajeria';
  private mensajeriaSubject = new BehaviorSubject<mensajeria[] | []>([]);
  private mensajeriaHistorialSubject = new BehaviorSubject<mensajeria_historial[] | []>([]);
  private mensajeria:mensajeria[]=[]
  private mensajeriaHistorial:mensajeria_historial[]=[]
  private destinatariosSubject = new BehaviorSubject<destinatario[] | []>([]);
  private destinatarios:destinatario[]=[]
  private nuevoDestinatario=new BehaviorSubject<destinatario| null>(null);

  private usuarioDatos!:usuarioDatos


  constructor(private http: HttpClient,
    usuarioDatosService:DatosUsuarioService) {
      usuarioDatosService.obtenerDatos().subscribe({
        next:(usuario)=>{
          if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
            this.usuarioDatos = usuario
            this.getMensajeria()
          }
        }
      })
    }


    private getMensajeria(){
      this.http.get<{ data: any }>(`${this.apiUrl}/show_mensajeria/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }}).subscribe({
        next:(respuesta)=>{
          this.mensajeria = respuesta.data[0].chats_activos
          this.emitirMensajeria()
        }
      })
    }

    private emitirMensajeria(){
      this.mensajeriaSubject.next(this.mensajeria)
    }

    SubscriptionMensajeria():Observable<mensajeria[]>{
      return this.mensajeriaSubject.asObservable()
    }

    obtenerMensajeria(){
      this.getMensajeria()
    }

    //Historial mensajeria
    SuscripcionHistorial():Observable<mensajeria_historial[]>{
      return this.mensajeriaHistorialSubject.asObservable()
    }

    obtenerHistorial(id_chat:number){
      this.getHistorial(id_chat)
    }

    private getHistorial(id_chat:number){
      this.http.get<{ data: any }>(`${this.apiUrl}/historial_mensajes/${this.usuarioDatos.ID_Institucion}`, {params: { id_chat: id_chat }}).subscribe({
        next:(respuesta)=>{
          this.mensajeriaHistorial = respuesta.data
          this.emitirMensajeriaHistorial()
        }
      })
    }

    private emitirMensajeriaHistorial(){
      this.mensajeriaHistorialSubject.next(this.mensajeriaHistorial)
    }

    // Enviar Chat
    enviarChat(chat:{chat:string,id_chat:number}){
      this.http.post(`${this.apiUrl}/enviar_chat/${this.usuarioDatos.ID_Institucion}`,chat).subscribe({
        next:(respuesta:any)=>{
          this.mensajeriaHistorial = respuesta.data[0].chats.reverse()
          this.emitirMensajeriaHistorial()
        }
      })
    }

    //destinatarios
    private getDestinatarios(){
      this.http.get<{ data: any }>(`${this.apiUrl}/destinatarios_chats/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }}).subscribe({
        next:(respuesta)=>{
          this.destinatarios = respuesta.data
          this.emitirDestinatarios()
        }
      })
    }

    private emitirDestinatarios(){
      this.destinatariosSubject.next(this.destinatarios)
    }

    suscripcionDestinatarios(){
      return this.destinatariosSubject.asObservable()
    }

    obtenerDestinatarios(){
      this.getDestinatarios()
    }

    //nuevo chat
    private enviarNuevoChat(nuevo: nuevoChat): Observable<number> {
      return this.http.post<{ data: any }>(`${this.apiUrl}/nuevo_chat/${this.usuarioDatos.ID_Institucion}`, nuevo)
        .pipe(
          map(respuesta => {
            return respuesta.data[0].id_chat;
          })
        );
    }

    enviarChatNuevo(destinatario: destinatario, mensaje: string): Observable<number> {
      if (destinatario && mensaje) {
        let nuevo = new nuevoChat(this.usuarioDatos.ID_Usuario_Interno, destinatario.responsables[0].id, destinatario.id, mensaje);
        return this.enviarNuevoChat(nuevo);
      } else {
        return of(-1); // Por ejemplo, retorna -1 para indicar un error o situación especial
      }
    }

    establecerDestinatario(destinatario?: destinatario): void {
      const destinatarioEncontrado = destinatario && this.destinatarios.find(dest => dest === destinatario);
      this.nuevoDestinatario.next(destinatarioEncontrado || null);
    }

    obtenerNuevoDestinatario():Observable<destinatario|null>{
      return this.nuevoDestinatario.asObservable()
    }

    borrarDestinatario(){
      this.nuevoDestinatario.next(null)
    }

    //establecer lectura
    marcarLeido(idchat:number){
      this.http.put<{ data: any }>(`${this.apiUrl}/lectura_mensajeria/${this.usuarioDatos.ID_Institucion}?id_chat=${idchat}`,null).subscribe({
        next:(respuesta)=>{

        }
      })
    }

    borrarMensaje(idMensaje: number){
     this.http.put<{ data: any }>(`${this.apiUrl}/borrar_mensaje/${this.usuarioDatos.ID_Institucion}?id_usuario=${this.usuarioDatos.ID_Usuario_Interno}&id_mensaje=${idMensaje}`, null).subscribe({
      next:(respuesta)=>{
        if (respuesta.data && respuesta.data[0]?.chats){
          this.mensajeriaHistorial = respuesta.data[0].chats.reverse()
          this.emitirMensajeriaHistorial()
          return
        }
        this.mensajeriaHistorial = []
        this.emitirMensajeriaHistorial()
      }
     })
    }

}
