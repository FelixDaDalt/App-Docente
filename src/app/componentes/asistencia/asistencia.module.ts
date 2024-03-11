import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaComponent } from './asistencia.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { AsistenciaInformacionComponent } from './asistencia-informacion/asistencia-informacion.component';
import { AsistenciaRoutingModule } from './asistencia-routing';



@NgModule({
  declarations: [
    AsistenciaComponent,
    AsistenciaInformacionComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    AsistenciaRoutingModule
  ]
})
export class AsistenciaModule { }
