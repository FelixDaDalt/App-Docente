import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {

  formulario:string = "Hola Mundo"

  constructor(private active:NgbActiveModal){

  }

  cerrarModal(){
    this.active.close(this.formulario)
  }


}
