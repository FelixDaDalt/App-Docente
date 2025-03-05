import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaComponent } from './asistencia.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { AsistenciaInformacionComponent } from './asistencia-informacion/asistencia-informacion.component';
import { AsistenciaRoutingModule } from './asistencia-routing';
import { RoleDirective } from 'src/app/directiva/role.directiva';



@NgModule({
  declarations: [
    AsistenciaComponent,
    AsistenciaInformacionComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    AsistenciaRoutingModule,
    RoleDirective
  ]
})
export class AsistenciaModule { }
