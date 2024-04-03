import { Injectable } from '@angular/core';
import { usuarioLogin } from '../modelos/usuarioLogin';
import { NotificacionService } from '../otros/notificacion-popup/notificacionpopup.service';
import { DatosUsuarioService } from './datos-usuario.service';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { Institucion, usuarioDatos } from '../modelos/usuarioDatos';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'https://apirest.geoacademico.com.ar/api/auth/login';
  private tokenKey = 'token_Geo_Doc';
  private tokenExpiracion = 'token_expiracion_Geo_Doc';

  constructor(private localStorageService: LocalStorageService,
    private datosUsuarioService: DatosUsuarioService,
    private notificacionService:NotificacionService,
    private router:Router,
    private http: HttpClient) { }


    login(usuarioLogin: usuarioLogin): Observable<boolean> {
      return this.http.post<any>(this.apiUrl, usuarioLogin).pipe(
        map((respuesta) => {
          if (respuesta && respuesta.access_token) {
            this.establecerToken(respuesta.access_token, respuesta.expires_in);
            let usuarioDatos: usuarioDatos = respuesta.user;
            this.datosUsuarioService.establecerDatos(usuarioDatos);
            return true;
          } else {
            throw new Error('Credenciales inválidas');
          }
        }),
        catchError((error) => {
          this.notificacionService.establecerNotificacion('Error', 'Credenciales Inválidas');
          return of(false);
        })
      );
    }

  private establecerToken(token: string, expiracionEnSeg: number): void {
    const expiracionFecha = new Date();
    expiracionFecha.setTime(expiracionFecha.getTime() + expiracionEnSeg * 1000);
    this.localStorageService.establecerItem(this.tokenKey, token);
    this.localStorageService.establecerItem(this.tokenExpiracion, expiracionFecha.toISOString());
  }

  logout(): void {
    this.localStorageService.eliminarItem(this.tokenKey);
    this.localStorageService.eliminarItem(this.tokenExpiracion);
    this.datosUsuarioService.elminarDatos();
    this.notificacionService.establecerNotificacion('Exito','Sesión cerrada')
    this.router.navigate(['login'])
  }

  obtenerToken(){
    const token = this.localStorageService.obtenerItem('token_Geo_Doc')
    return token
  }


}
