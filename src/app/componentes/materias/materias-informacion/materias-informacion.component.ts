import { Component, Input } from '@angular/core';
import { materias } from '../../home/home';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-materias-informacion',
  templateUrl: './materias-informacion.component.html',
  styleUrls: ['./materias-informacion.component.css']
})
export class MateriasInformacionComponent {

  @Input() Informacion$?:Observable<materias | null>=of(null)
  @Input() rol?:string | null
}
