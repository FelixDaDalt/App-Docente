import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaComponent } from './asistencia.component';

const AsistenciaRoutes: Routes = [
  {
    path: '',
    component: AsistenciaComponent,
  },
  {
    path: 'ver/:fecha/:id',
    component: AsistenciaComponent
   },
];

@NgModule({
  imports: [
    RouterModule.forChild(AsistenciaRoutes)
  ],
  exports: [RouterModule]
})
export class AsistenciaRoutingModule { }
