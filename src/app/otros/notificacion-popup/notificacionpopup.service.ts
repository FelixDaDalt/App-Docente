import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { notificacionPopup } from './notificacionpopup';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private notificacion= new Subject<notificacionPopup>

  constructor() { }

  establecerNotificacion(titulo:string,mensaje:string){
    let notificacion:notificacionPopup ={
      titulo:titulo,
      mensaje:mensaje,
      hora:new Date().toLocaleTimeString()
    }
    this.notificacion.next(notificacion)
  }

  obtenerNotificacion():Observable<notificacionPopup >{
    return this.notificacion.asObservable()
  }

}
