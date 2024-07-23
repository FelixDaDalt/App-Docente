import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, Subscription, delay, finalize, fromEvent, map, startWith, switchMap, tap } from 'rxjs';
import { SpinnerService } from '../otros/spinner/spinner.service';
import { NotificacionService } from '../otros/notificacion-popup/notificacionpopup.service';
import { LoginService } from '../servicios/login.service';


declare var offlineMode: any;
@Injectable()
export class RequestInterceptorInterceptor implements HttpInterceptor {

  private exclusionPatterns: string[] = ['lectura_mensajeria/', 'lectura_notificacion/','lectura_comunicado/','enviar_chat/','notificaciones/','agregar_editar_calificacion_alumno/','novedades/','conexiones/'];
  private isConnectedSubject: BehaviorSubject<boolean>;
  private isConnected=false

  constructor(private loginService: LoginService,
    private spinnerService:SpinnerService,
    private notificacionService:NotificacionService) {

      this.isConnectedSubject = new BehaviorSubject<boolean>(navigator.onLine);
      window.addEventListener('online', () => {
        this.isConnectedSubject.next(true);
      });
      window.addEventListener('offline', () => {
        this.isConnectedSubject.next(false);
      });

      this.checkInternetConnectivity()
    }

    private checkInternetConnectivity() {
      this.isConnectedSubject.subscribe({
        next:(respuesta)=>{
          this.isConnected = respuesta
        }
      })
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.shouldIntercept(request.url)){
      this.spinnerService.notificarSpinner()
    }

    if(this.isConnected)
    {
          // Verifica si la solicitud se dirige a la URL de inicio de sesión
          if (request.url !== 'https://apiteach.geoeducacion.com.ar/api/auth/login') {
            const token = this.loginService.obtenerToken();
            if (token) {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
            }
          }

          return next.handle(request).pipe(
            tap(
              (event) => {
                if (event.type === HttpEventType.Response) {
                  if ((request.method === 'PUT' || request.method === 'POST') && this.shouldIntercept(request.url)) {
                    const responseData = (event as any).body?.data;
                    const messageToShow = typeof responseData === 'string' ? responseData : 'Solicitud Exitosa';
                    this.notificacionService.establecerNotificacion('Exito', messageToShow);
                  }

                }
              },
              (error) => {
                if(!request.url.includes('login'))
                this.notificacionService.establecerNotificacion('Error', 'Error al procesar solicitud');
              }
            ),
            finalize(() => {
              setTimeout(() => {
                this.spinnerService.ocultarSpinner();
              }, 2000);

            })
          )
    }else{
      offlineMode();
      return EMPTY
    }




  }

  private shouldIntercept(url: string): boolean {
    return !this.exclusionPatterns.some(pattern => url.includes(pattern));
  }
}

