import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { DatosUsuarioService } from './datos-usuario.service';
import { usuarioLogin } from '../modelos/usuarioLogin';
import { Observable, BehaviorSubject} from 'rxjs';
import { usuarioDatos } from '../modelos/usuarioDatos';
import { NotificacionService } from '../otros/notificacion-popup/notificacionpopup.service';

@Injectable({
  providedIn: 'root'
})
export class AutentificacionService {

  private apiUrl = 'https://apirest.geoacademico.com.ar/api/auth/login';
  private tokenKey = 'token_Geo_Doc';
  private tokenExpiracion = 'token_expiracion_Geo_Doc';

  // BehaviorSubject para notificar el estado de autenticación
  private autenticadoSubject = new BehaviorSubject<boolean>(false);
  private seleccionInstitucionSubject = new BehaviorSubject<boolean>(false);
  private seleccionRolSubject = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient,
    private localStorageService: LocalStorageService,
    private datosUsuarioService: DatosUsuarioService,
    private notificacionService:NotificacionService
    )
    {
      this.notificarToken()
      this.verificarAutentificacion()
    }

    //Verificar si esta autetificado
    verificarAutentificacion() {
      this.obtenerToken().subscribe({
        next:(token)=>{
          if (token !== null) { // si existe
            if (this.tokenExpirado()) { //verificar que no este expirado
              this.logout();
            } else {
              this.continuarVerificacion();
            }
          } else {

            this.logout();
          }
        },
        error:(error)=>{
          this.notificacionService.establecerNotificacion('Error','Credenciales Invalidas')
        }
      })
    }

    private continuarVerificacion() {
      this.datosUsuarioService.obtenerDatos().subscribe(usuario => {
        if (usuario) {
          if (!usuario.ID_Institucion) {
            this.establecerAutentificado(false);
            this.establecerInstitucion(true);
          } else if (usuario.Rol_selected === undefined) {
            this.establecerAutentificado(false);
            this.establecerRol(true);
          } else {
            this.establecerInstitucion(false);
            this.establecerRol(false);
            this.establecerAutentificado(true);
            this.notificacionService.establecerNotificacion('Exito','Autentificación Exitosa')
          }
        }
      });
    }

    login(usuarioLogin: usuarioLogin) {
      this.http.post<any>(this.apiUrl, usuarioLogin).subscribe({
        next:(respuesta) => {
          console.log(respuesta)
          if (respuesta && respuesta.access_token) {
            this.establecerToken(respuesta.access_token, respuesta.expires_in);
            let usuarioDatos: usuarioDatos = respuesta.user;
            this.datosUsuarioService.establecerDatos(usuarioDatos);
          }
        },
        error:(error) => {
          this.notificacionService.establecerNotificacion('Error','Credenciales Invalidas')
        }
      });
    }

    logout(): void {
      // Eliminar token y datos de usuario
      this.localStorageService.eliminarItem(this.tokenKey);
      this.datosUsuarioService.elminarDatos();
      // Notificar que el usuario ya no está autenticado
      this.establecerAutentificado(false)
      this.establecerInstitucion(false)
      this.establecerRol(false)
      this.notificacionService.establecerNotificacion('Exito','Sesión cerrada')
    }

    establecerToken(token: string, expiracionEnSeg: number): void {
      const expiracionFecha = new Date();
      expiracionFecha.setTime(expiracionFecha.getTime() + expiracionEnSeg * 1000);
      this.localStorageService.establecerItem(this.tokenKey, token);
      this.localStorageService.establecerItem(this.tokenExpiracion, expiracionFecha.toISOString());
      this.notificarToken();
    }

    notificarToken() {
      const token = this.localStorageService.obtenerItem(this.tokenKey);
      this.tokenSubject.next(token);
    }

    obtenerToken(): Observable<string | null> {
      return this.tokenSubject.asObservable();
    }

    tokenExpirado(): boolean {
      const expiracion = this.localStorageService.obtenerItem(this.tokenExpiracion);
      if (!expiracion) {
        return true;
      }
      const expiraFecha = new Date(expiracion);
      return expiraFecha <= new Date();
    }

    estaAutenticado(): Observable<boolean> {
      return this.autenticadoSubject.asObservable();
    }

    seleccionoInstitucion():Observable<boolean>{
      return this.seleccionInstitucionSubject.asObservable()
    }

    seleccionoRol():Observable<boolean>{
      return this.seleccionRolSubject.asObservable()
    }

    private establecerAutentificado(bool:boolean){
      this.autenticadoSubject.next(bool);
    }

    private establecerInstitucion(bool:boolean){
      this.seleccionInstitucionSubject.next(bool)
    }

    private establecerRol(bool:boolean){
      this.seleccionRolSubject.next(bool)
    }

    //establecer se si va a editar la institucion o el rol
    establecerOpciones(institucion?:boolean, rol?:boolean){
      this.establecerAutentificado(false)
      if(institucion)
        this.establecerInstitucion(institucion)
      if(rol)
        this.establecerRol(rol)
    }
}
