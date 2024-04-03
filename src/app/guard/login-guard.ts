
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../servicios/local-storage.service';
import { usuarioDatos } from '../modelos/usuarioDatos';




export const loginGuard: CanActivateFn = (route, state) => {

  const localStorageService= inject(LocalStorageService)
  const router = inject(Router);

  const token = localStorageService.obtenerItem('token_Geo_Doc');
  const expiracion = localStorageService.obtenerItem('token_expiracion_Geo_Doc');
  const expiraFecha = new Date(expiracion);
  const datos:usuarioDatos = localStorageService.obtenerItem('usuario_App_Geo')

  if (token && expiracion && expiraFecha > new Date() && state.url==='/login' && datos.Institucion_selected && datos.Rol_selected) {
    return router.createUrlTree(['/dashboard']);
  }



  return true

}
