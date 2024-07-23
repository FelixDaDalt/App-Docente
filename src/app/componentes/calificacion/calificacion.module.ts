import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificacionInstrumentosComponent } from './calificacion-instrumentos/calificacion-instrumentos.component';
import { CalificacionNotasComponent } from './calificacion-notas/calificacion-notas.component';
import { CalificacionNuevoComponent } from './calificacion-nuevo-instrumento/calificacionNuevo.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { CalificacionesRoutingModule } from './calificacion-routing';
import { CalificacionComponent } from './calificacion.component';



@NgModule({
  declarations: [
    CalificacionNuevoComponent,
    CalificacionNotasComponent,
    CalificacionInstrumentosComponent,
    CalificacionComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    CalificacionesRoutingModule
  ]
})
export class CalificacionModule { }
