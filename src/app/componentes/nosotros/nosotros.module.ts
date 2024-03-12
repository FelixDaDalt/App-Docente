import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { NosotrosRoutingModule } from './nosotros-routing';



@NgModule({
  declarations: [
    NosotrosComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    NosotrosRoutingModule
  ]
})
export class NosotrosModule { }
