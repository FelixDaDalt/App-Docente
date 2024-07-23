import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DatosUsuarioService } from '../servicios/datos-usuario.service';

@Injectable()
export class UserParamsInterceptor implements HttpInterceptor {
  private usuarioDatos!: any;

  constructor(private usuarioDatosService: DatosUsuarioService) {
    this.usuarioDatosService.obtenerDatos().subscribe({
      next: (usuario) => {
        if (usuario && usuario.Institucion_selected && usuario.Rol_selected) {
          this.usuarioDatos = usuario;
        }
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica si los datos del usuario están disponibles
    if (this.usuarioDatos && this.usuarioDatos.Rol_selected) {
      const params = req.params
        .set('rol', this.usuarioDatos.Rol_selected.rol)
        .set('id_nivel', this.usuarioDatos.Rol_selected.id_nivel);

      const modifiedReq = req.clone({ params });
      return next.handle(modifiedReq);
    }

    // Si los datos del usuario no están disponibles, continúa con la solicitud original
    return next.handle(req);
  }
}
