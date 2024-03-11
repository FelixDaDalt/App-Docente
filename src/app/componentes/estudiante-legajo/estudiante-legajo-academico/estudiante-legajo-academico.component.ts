import { Component, Input, OnInit } from '@angular/core';
import { academico } from '../legajo';

@Component({
  selector: 'app-estudiante-legajo-academico',
  templateUrl: './estudiante-legajo-academico.component.html',
  styleUrls: ['./estudiante-legajo-academico.component.css']
})
export class EstudianteLegajoAcademicoComponent implements OnInit{

  @Input() academicos?:academico[]
  academicoSeleccionado?:academico

  ngOnInit(): void {
    if(this.academicos && this.academicos.length>0)
      this.academicoSeleccionado = this.academicos?.[0]
  }

}
