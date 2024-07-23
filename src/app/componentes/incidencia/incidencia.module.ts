import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenciaRoutingModule } from './incidencia-routing';
import { CrearComponent } from './crear/crear.component';
import { IncidenciaComponent } from './incidencia.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { ListaComponent } from './lista/lista.component';



@NgModule({
  declarations: [
    CrearComponent,
    IncidenciaComponent,
    ListaComponent
  ],
  imports: [
    CommonModule,
    IncidenciaRoutingModule,
    CompartidoModule
  ]
})
export class IncidenciaModule { }
