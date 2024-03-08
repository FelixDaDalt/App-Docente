import { Component, Input } from '@angular/core';
import { resultadoBusqueda } from 'src/app/componentes/home/home';

@Component({
  selector: 'app-estudiante-legajo-informacion',
  templateUrl: './estudiante-legajo-informacion.component.html',
  styleUrls: ['./estudiante-legajo-informacion.component.css']
})
export class EstudianteLegajoInformacionComponent {

  @Input() alumno?:resultadoBusqueda
}
