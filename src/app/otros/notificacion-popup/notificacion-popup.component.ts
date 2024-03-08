import { Component } from '@angular/core';
import { NotificacionService} from 'src/app/otros/notificacion-popup/notificacionpopup.service';
import { notificacionPopup } from './notificacionpopup';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion-popup.component.html',
  styleUrls: ['./notificacion-popup.component.css']
})
export class NotificacionPopupComponent {

  notificaciones:notificacionPopup[] = []

  constructor(private notificacionService:NotificacionService){
    this.notificacionService.obtenerNotificacion().subscribe({
      next: (notificacion) => {
        this.notificaciones.push(notificacion)
        setTimeout(() => this.cerrarNotificacion(notificacion), 5000); // Cerrar la notificación automáticamente después de 5 segundos
      }
    });
  }

  cerrarNotificacion(notificacion:notificacionPopup) {
    const index = this.notificaciones.indexOf(notificacion);
    if (index !== -1) {
      this.notificaciones.splice(index, 1);
    }
  }

  obtenerClaseNotificacion(notificacion:notificacionPopup): string {
    if (!notificacion || !notificacion.titulo) {
      return '';
    }
    let caso = notificacion.titulo.toLocaleLowerCase()
    switch (caso) {
      case 'exito':
        return 'alert alert-success alert-dismissible fade show';
      case 'error':
        return 'alert alert-danger alert-dismissible fade show';
      case 'otro':
        return 'alert alert-light alert-dismissible fade show';
      default:
        return 'alert alert-light alert-dismissible fade show';
    }
  }
}
