import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DifusionesComponent } from './difusiones.component';
import { DifusionesRoutingModule } from './difusiones-routing';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { NuevaDifusionComponent } from './nueva-difusion/nueva-difusion.component';
import { ListaDifusionComponent } from './lista-difusion/lista-difusion.component';
import { EditarDifusionComponent } from './editar-difusion/editar-difusion.component';




@NgModule({
  declarations: [
    DifusionesComponent,
    NuevaDifusionComponent,
    ListaDifusionComponent,
    EditarDifusionComponent
  ],
  imports: [
    CommonModule,
    DifusionesRoutingModule,
    CompartidoModule
  ]
})
export class DifusionesModule { }
