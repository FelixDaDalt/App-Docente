import { CrearComponent } from './crear/crear.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidenciaComponent } from './incidencia.component';
import { ListaComponent } from './lista/lista.component';


const TutorialesRoutes: Routes = [
  {
    path: '', //Incidencia
    component: IncidenciaComponent,
    children:[
      {
        path:'', //incidencia/
        component:ListaComponent
      },
      {
      path:'crear', //incidencia/crear
      component:CrearComponent
    }]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(TutorialesRoutes)
  ],
  exports: [RouterModule]
})
export class IncidenciaRoutingModule { }
