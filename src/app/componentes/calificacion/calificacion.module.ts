import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificacionInstrumentosComponent } from './calificacion-instrumentos/calificacion-instrumentos.component';
import { CalificacionNotasComponent } from './calificacion-notas/calificacion-notas.component';
import { CalificacionComponent } from './calificacion-nuevo-instrumento/calificacion.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { CalificacionesRoutingModule } from './calificacion-routing';



@NgModule({
  declarations: [
    CalificacionComponent,
    CalificacionNotasComponent,
    CalificacionInstrumentosComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    CalificacionesRoutingModule
  ]
})
export class CalificacionModule { }
