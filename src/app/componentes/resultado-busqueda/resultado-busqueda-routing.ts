import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultadoBusquedaComponent } from './resultado-busqueda.component';


const BusquedaRoutes: Routes = [
  {
    path: ':termino',
    component: ResultadoBusquedaComponent,
    loadChildren: () => import('../estudiante-legajo/estudiante-legajo.module').then(m => m.EstudianteLegajoModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(BusquedaRoutes)
  ],
  exports: [RouterModule]
})
export class BusquedaRoutingModule { }
