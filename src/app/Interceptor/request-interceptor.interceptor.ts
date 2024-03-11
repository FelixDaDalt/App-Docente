import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable, delay, finalize, tap } from 'rxjs';
import { AutentificacionService } from '../servicios/autentificacion.service';
import { SpinnerService } from '../otros/spinner/spinner.service';
import { NotificacionService } from '../otros/notificacion-popup/notificacionpopup.service';


@Injectable()
export class RequestInterceptorInterceptor implements HttpInterceptor {

  private exclusionPatterns: string[] = ['lectura_mensajeria/', 'lectura_notificacion/','enviar_chat/','notificaciones/','agregar_editar_calificacion_alumno/','novedades/'];

  constructor(private authService: AutentificacionService,
    private spinnerService:SpinnerService,
    private notificacionService:NotificacionService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.shouldIntercept(request.url)){
      this.spinnerService.notificarSpinner()
    }

    // Verifica si la solicitud se dirige a la URL de inicio de sesión
    if (request.url !== 'https://apiteach.geoeducacion.com.ar/api/auth/login') {
      const token = this.authService.obtenerToken();
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
    );
  }

  private shouldIntercept(url: string): boolean {
    return !this.exclusionPatterns.some(pattern => url.includes(pattern));
  }
}

