import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { incidencia } from '../incidencia';
import { CrearComponent } from '../crear/crear.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent {

  incidencias:incidencia[]=[]

  constructor(private modal:NgbModal){}

  cargarIncidencia(){
    const modal = this.modal.open(CrearComponent)
    modal.result.then((respuesta:incidencia)=>{
      this.incidencias.push(respuesta)

    })
  }


}
