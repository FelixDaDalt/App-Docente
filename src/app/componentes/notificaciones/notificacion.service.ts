import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { DetalleAviso, DetalleDocumentacion, DetalleEntrevista, DetalleFalta, DetalleFamiliar, DetallePedagogico, DetalleRetiros, DetalleReunion, DetalleSancion, notificacion } from './notificacion';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/notificaciones';
  private notificacionesSubject = new BehaviorSubject<notificacion | null>(null);
  private entrevistasSubject = new BehaviorSubject<{ entrevistas: number, detalle_entrevistas: DetalleEntrevista[] } | null>(null);
  private avisosSubject = new BehaviorSubject<{ avisos: number, detalle_avisos: DetalleAviso[] } | null>(null);
  private familiaresSubject = new BehaviorSubject<{ familiares: number, detalle_familiares: DetalleFamiliar[] } | null>(null);
  private sancionesSubject = new BehaviorSubject<{ sanciones: number, detalle_sanciones: DetalleSancion[] } | null>(null);
  private documentacionSubject = new BehaviorSubject<{ documentaciones: number, detalle_documentaciones: DetalleDocumentacion[] } | null>(null);
  private pedagogicaSubject = new BehaviorSubject<{ pedagogicas: number, detalle_pedagogicos: DetallePedagogico[] } | null>(null);
  private faltasSubject = new BehaviorSubject<{ faltas: number, detalle_faltas: DetalleFalta[] } | null>(null);
  private retirosSubject = new BehaviorSubject<{ avisos_retiro: number, detalle_avisos_retiro: DetalleRetiros[] } | null>(null);
  private reunionesSubject = new BehaviorSubject<{ rta_solicitudes_reunion: number, detalle_rta_solicitudes_reunion: DetalleReunion[] } | null>(null);

  private notificaciones!:notificacion
  private usuarioDatos!:usuarioDatos

  constructor(private datosUsuarioService:DatosUsuarioService,
    private http: HttpClient) {
    this.obtenerDatosUsuario()
  }

  private obtenerDatosUsuario(){
    this.datosUsuarioService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if(usuario)
        {
          this.usuarioDatos = usuario
          this.getNotificaciones()
        }
      }
    })
  }

  private getNotificaciones(){
   const suscripcion = this.http.get<{ data: any }>(`${this.apiUrl}/cantidad_notificaciones/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno }})
    .subscribe({
      next:(respuesta)=>{
        this.notificaciones = respuesta.data
        this.emitirEvento(this.notificacionesSubject, this.notificaciones);
        this.emitirEvento(this.entrevistasSubject, { entrevistas: this.notificaciones.entrevistas, detalle_entrevistas: this.notificaciones.detalle_entrevistas });
        this.emitirEvento(this.avisosSubject, { avisos: this.notificaciones.avisos, detalle_avisos: this.notificaciones.detalle_avisos });
        this.emitirEvento(this.familiaresSubject, { familiares: this.notificaciones.familiares, detalle_familiares: this.notificaciones.detalle_familiares });
        this.emitirEvento(this.sancionesSubject, { sanciones: this.notificaciones.sanciones, detalle_sanciones: this.notificaciones.detalle_sanciones });
        this.emitirEvento(this.documentacionSubject, { documentaciones: this.notificaciones.documentacion, detalle_documentaciones: this.notificaciones.detalle_documentacion });
        this.emitirEvento(this.pedagogicaSubject, { pedagogicas: this.notificaciones.pedagogicas, detalle_pedagogicos: this.notificaciones.detalle_pedagogicas });
        this.emitirEvento(this.faltasSubject, { faltas: this.notificaciones.faltas, detalle_faltas: this.notificaciones.detalle_faltas });
        this.emitirEvento(this.retirosSubject, { avisos_retiro: this.notificaciones.avisos_retiro, detalle_avisos_retiro: this.notificaciones.detalle_avisos_retiro });
        this.emitirEvento(this.reunionesSubject, { rta_solicitudes_reunion: this.notificaciones.rta_solicitudes_reunion, detalle_rta_solicitudes_reunion: this.notificaciones.detalle_rta_solicitudes_reunion });
      },
      complete:()=>{
        suscripcion.unsubscribe()
      }
    })
  }

  private emitirEvento<T>(subject: BehaviorSubject<T>, data: T) {
    subject.next(data);
  }

  obtenerNotificaciones(){
    this.getNotificaciones()
    return this.notificacionesSubject.asObservable()
  }

  obtenerEntrevistas() {
    return this.entrevistasSubject.asObservable();
  }
  obtenerAvisos() {
    return this.avisosSubject.asObservable();
  }
  obtenerFamiliares() {
    return this.familiaresSubject.asObservable();
  }
  obtenerSanciones() {
    return this.sancionesSubject.asObservable();
  }
  obtenerDocumentacion() {
    return this.documentacionSubject.asObservable();
  }
  obtenerPedagogico() {
    return this.pedagogicaSubject.asObservable();
  }
  obtenerFaltas() {
    return this.faltasSubject.asObservable();
  }
  obtenerRetiros() {
    return this.retirosSubject.asObservable();
  }
  obtenerReuniones() {
    return this.reunionesSubject.asObservable();
  }

  marcarLeido(id_notificacion: number): void {
    const leidoSus = this.leido(id_notificacion).subscribe({
      next: (respuesta) => {
        this.getNotificaciones()
      },
      complete:()=>{
        leidoSus.unsubscribe()
      }
    });
  }

  private leido(id_notificacion: number): Observable<{ data: any }> {
    return this.http.put<{ data: any }>(`${this.apiUrl}/lectura_notificacion/${this.usuarioDatos.ID_Institucion}`, {id_usuario:this.usuarioDatos.ID_Usuario_Interno, id_notificacion:id_notificacion, id_nivel:this.usuarioDatos.Rol_selected?.id_nivel});
  }


}
