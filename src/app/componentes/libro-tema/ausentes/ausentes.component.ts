import { Component, Input } from '@angular/core';
import { AlumnoAusente, libroTema } from '../libro-tema';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ausentes',
  templateUrl: './ausentes.component.html',
  styleUrls: ['./ausentes.component.css']
})
export class AusentesComponent {

  @Input() librotema?:libroTema

  constructor(public activeModal: NgbActiveModal){

  }


}
