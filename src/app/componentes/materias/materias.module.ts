import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriasAlumnosComponent } from './materias-alumnos/materias-alumnos.component';
import { MateriasCalificacionesComponent } from './materias-calificaciones/materias-calificaciones.component';
import { MateriasInformacionComponent } from './materias-informacion/materias-informacion.component';
import { MateriasLibroTemasComponent } from './materias-libro-temas/materias-libro-temas.component';
import { MateriasParteAsistenciaComponent } from './materias-parte-asistencia/materias-parte-asistencia.component';
import { MateriasComponent } from './materias.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { MateriasRoutingModule } from './materias-routing';



@NgModule({
  declarations: [
    MateriasComponent,
    MateriasInformacionComponent,
    MateriasLibroTemasComponent,
    MateriasCalificacionesComponent,
    MateriasAlumnosComponent,
    MateriasParteAsistenciaComponent,
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    MateriasRoutingModule
  ]
})
export class MateriasModule { }
