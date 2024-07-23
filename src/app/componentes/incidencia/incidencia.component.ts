import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrearComponent } from './crear/crear.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-incidencia',
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css']
})
export class IncidenciaComponent {

  mensaje="No tengo nada"
  constructor(private modal:NgbModal,
    private route:Router
  ){}

  abrirModal(){
    const modal = this.modal.open(CrearComponent,{backdrop:'static', size:'xl'})
    modal.result.then(variable =>{
      this.mensaje = variable
    })
  }


}
