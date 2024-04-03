import { Component, Input } from '@angular/core';
import { comunicado_enviado_Destinatario } from '../comunicado-enviado';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comunicados-enviados-destinatarios',
  templateUrl: './comunicados-enviados-destinatarios.component.html',
  styleUrls: ['./comunicados-enviados-destinatarios.component.css']
})
export class ComunicadosEnviadosDestinatariosComponent {

 @Input() destinatarios:comunicado_enviado_Destinatario[]=[]

 constructor(public activeModal: NgbActiveModal){}

}
