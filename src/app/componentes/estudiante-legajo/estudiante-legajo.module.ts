import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudianteLegajoComponent } from './estudiante-legajo.component';
import { EstudianteLegajoAcademicoComponent } from './estudiante-legajo-academico/estudiante-legajo-academico.component';
import { EstudianteLegajoInasistenciaComponent } from './estudiante-legajo-inasistencia/estudiante-legajo-inasistencia.component';
import { EstudianteLegajoInformacionComponent } from './estudiante-legajo-informacion/estudiante-legajo-informacion.component';
import { EstudianteLegajoLegajoComponent } from './estudiante-legajo-legajo/estudiante-legajo-legajo.component';
import { LegajoRoutingModule } from './estudiante-legajo-routing';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { EstudianteLegajoModalComponent } from './estudiante-legajo-legajo/estudiante-legajo-modal/estudiante-legajo-modal.component';



@NgModule({
  declarations: [
    EstudianteLegajoComponent,
    EstudianteLegajoAcademicoComponent,
    EstudianteLegajoInasistenciaComponent,
    EstudianteLegajoInformacionComponent,
    EstudianteLegajoLegajoComponent,
    EstudianteLegajoModalComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    LegajoRoutingModule
  ]
})
export class EstudianteLegajoModule { }
