import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { LibroTemaComponent } from './libro-tema.component';
import { AusentesComponent } from './ausentes/ausentes.component';
import { LibroTemaRoutingModule } from './libro-tema-routing';



@NgModule({
  declarations: [
    LibroTemaComponent,
    AusentesComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    LibroTemaRoutingModule
  ]
})
export class LibroTemaModule { }
