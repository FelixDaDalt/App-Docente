import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReunionesComponent } from './reuniones.component';
import { NuevaReunionComponent } from './nueva-reunion/nueva-reunion.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { ReunionesRoutingModule } from './reuniones-routing';
import { ReagendarReunionComponent } from './reagendar-reunion/reagendar-reunion.component';



@NgModule({
  declarations: [
    ReunionesComponent,
    NuevaReunionComponent,
    ReagendarReunionComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    ReunionesRoutingModule
  ]
})
export class ReunionesModule { }
