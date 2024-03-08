import { Component, Input } from '@angular/core';
import { inasistencia } from '../legajo';

@Component({
  selector: 'app-estudiante-legajo-inasistencia',
  templateUrl: './estudiante-legajo-inasistencia.component.html',
  styleUrls: ['./estudiante-legajo-inasistencia.component.css']
})
export class EstudianteLegajoInasistenciaComponent {
  @Input() inasistencia?:inasistencia
}
