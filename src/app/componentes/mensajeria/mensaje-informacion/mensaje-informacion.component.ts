import { Component,Input,OnDestroy,OnInit } from '@angular/core';
import { mensajeria_historial } from '../mensajeria';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MensajeriaService } from '../mensajeria.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-mensaje-informacion',
  templateUrl: './mensaje-informacion.component.html',
  styleUrls: ['./mensaje-informacion.component.css']
})
export class MensajeInformacionComponent {

  @Input() mensaje?:mensajeria_historial

  constructor(public activeModal: NgbActiveModal,
  private mensajeriaService:MensajeriaService) {}


  eliminarMensaje(){
    if(this.mensaje)
    {
      this.mensajeriaService.borrarMensaje(this.mensaje.id)
      this.activeModal.close()
    }
  }

}
