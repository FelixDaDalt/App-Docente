import { Component, Input, OnInit } from '@angular/core';
import { Aviso, Documento, Entrevista, Observacion, derivacion, legajoFalta, sancion, uniforme } from '../../legajo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estudiante-legajo-modal',
  templateUrl: './estudiante-legajo-modal.component.html',
  styleUrls: ['./estudiante-legajo-modal.component.css']
})
export class EstudianteLegajoModalComponent implements OnInit{
  @Input() objeto?: any
  tipoObjeto=''

  constructor(public activeModal: NgbActiveModal){
  }

  ngOnInit() {
    if(this.objeto){
      this.tipoObjeto = this.objeto.tipo_categoria
    }

  }

  descargarAdjunto(url:string): void {
    window.open(url, '_blank');
  }

  obtenerNombreArchivo(url: string): string {
    const partes = url.split('/');
    return partes.pop() || ''; // Si el array está vacío, devuelve una cadena vacía
  }
}
