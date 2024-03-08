import { Component, Input } from '@angular/core';
import { Asistencia } from '../asistencia';

@Component({
  selector: 'app-asistencia-informacion',
  templateUrl: './asistencia-informacion.component.html',
  styleUrls: ['./asistencia-informacion.component.css']
})
export class AsistenciaInformacionComponent {

  @Input() asistencia?:Asistencia

}
