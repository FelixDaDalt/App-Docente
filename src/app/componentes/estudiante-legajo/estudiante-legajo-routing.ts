import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstudianteLegajoComponent } from './estudiante-legajo.component';
import { IncidenciaComponent } from './incidencia/incidencia.component';


const LegajoRoutes: Routes = [
  {
    path: '',
    component: EstudianteLegajoComponent,
  },
  {
    path:'incidencia',
    component:IncidenciaComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(LegajoRoutes)
  ],
  exports: [RouterModule]
})
export class LegajoRoutingModule { }
