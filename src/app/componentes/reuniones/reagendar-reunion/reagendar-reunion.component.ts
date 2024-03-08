import { ReunionesService } from '../reuniones.service';
import { reunion } from './../reunion';
import { Component, Input, OnInit } from '@angular/core';
import { NotificacionService } from 'src/app/otros/notificacion-popup/notificacionpopup.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface reprogramar{
  id_usuario?:number
  titulo: string
  descripcion: string
  fecha: string
  hora: string
  id_solicitud: number
}

@Component({
  selector: 'app-reagendar-reunion',
  templateUrl: './reagendar-reunion.component.html',
  styleUrls: ['./reagendar-reunion.component.css']
})
export class ReagendarReunionComponent implements OnInit{
  @Input() reunion?:reunion
  mensaje?:string

  constructor(private reunionesService:ReunionesService,
    private notificacionService:NotificacionService,
    public activeModal: NgbActiveModal){ }


  ngOnInit(): void {
    this.mensaje = this.decodificarHTML(this.reunion!.descripcion)
  }

  capturarTexto(event:any): void {
    const textoEditado = event.target.innerHTML;
    this.mensaje = textoEditado
  }

  decodificarHTML(textoCodificado: string) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = textoCodificado;
    return textarea.value;
  }

  reprogramar(titulo: string, fecha:string, hora:string) {
    const tituloNoVacio = titulo.trim() !== '';
    const fechaNoVacio = fecha.trim() !== '';
    const horaNoVacio = hora.trim() !== '';
    const mensajeNoVacio = this.mensaje?.trim() !== '';

    if (tituloNoVacio && mensajeNoVacio && fechaNoVacio && horaNoVacio) {
      let reprogramar:reprogramar = {
        titulo:titulo,
        descripcion: this.mensaje!,
        fecha: fecha,
        hora: hora,
        id_solicitud: this.reunion!.id
      }

      this.reunionesService.reprogramar(reprogramar)
        .subscribe({
          next: (respuesta) => {
            this.activeModal.close()
          },
          error: (error) => {
            this.notificacionService.establecerNotificacion('Error', 'Error al enviar solicitud');
          }
        });

    } else {
      this.notificacionService.establecerNotificacion('Error', 'Error al enviar solicitud');
    }
  }

}
