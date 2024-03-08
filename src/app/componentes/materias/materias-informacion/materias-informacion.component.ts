import { Component, Input } from '@angular/core';
import { materias } from '../../home/home';

@Component({
  selector: 'app-materias-informacion',
  templateUrl: './materias-informacion.component.html',
  styleUrls: ['./materias-informacion.component.css']
})
export class MateriasInformacionComponent {

  @Input() Informacion?:materias | null
  @Input() rol?:string | null
}
