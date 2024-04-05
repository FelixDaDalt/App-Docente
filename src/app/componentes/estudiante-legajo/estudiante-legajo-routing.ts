import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstudianteLegajoComponent } from './estudiante-legajo.component';


const LegajoRoutes: Routes = [
  {
    path: '',
    component: EstudianteLegajoComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(LegajoRoutes)
  ],
  exports: [RouterModule]
})
export class LegajoRoutingModule { }
