import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialesComponent } from './tutoriales/tutoriales.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { TutorialesRoutingModule } from './tutoriales-routing';



@NgModule({
  declarations: [
    TutorialesComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    TutorialesRoutingModule
  ]
})
export class TutorialesModule { }
