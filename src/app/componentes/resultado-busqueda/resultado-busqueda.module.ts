import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadoBusquedaComponent } from './resultado-busqueda.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { BusquedaRoutingModule } from './resultado-busqueda-routing';



@NgModule({
  declarations: [
    ResultadoBusquedaComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    BusquedaRoutingModule
  ]
})
export class ResultadoBusquedaModule { }
