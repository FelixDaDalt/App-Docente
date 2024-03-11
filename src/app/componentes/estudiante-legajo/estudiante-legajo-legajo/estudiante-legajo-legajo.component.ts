import { Component, Input } from '@angular/core';
import { Aviso, legajo } from '../legajo';
import { EstudianteLegajoService } from '../estudiante-legajo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstudianteLegajoModalComponent } from './estudiante-legajo-modal/estudiante-legajo-modal.component';

@Component({
  selector: 'app-estudiante-legajo-legajo',
  templateUrl: './estudiante-legajo-legajo.component.html',
  styleUrls: ['./estudiante-legajo-legajo.component.css']
})
export class EstudianteLegajoLegajoComponent {

  @Input() legajo?:legajo

  constructor(private modal:NgbModal){}

  abrirModal(elemento:any){
    const modalRef = this.modal.open(EstudianteLegajoModalComponent);
    modalRef.componentInstance.objeto = elemento
  }
}
