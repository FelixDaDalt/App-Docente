import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DifusionesComponent } from './difusiones.component';
import { NuevaDifusionComponent } from './nueva-difusion/nueva-difusion.component';
import { ListaDifusionComponent } from './lista-difusion/lista-difusion.component';
import { EditarDifusionComponent } from './editar-difusion/editar-difusion.component';



const DifusionesRoutes: Routes = [
  {
    path: '',
    component: DifusionesComponent,
    children:[{
      path: '', // Esta será '/comunicados/nuevo-comunicado'
      component: ListaDifusionComponent
  },
  {
        path: 'nueva-difusion', // Esta será '/comunicados/nuevo-comunicado'
        component: NuevaDifusionComponent
    },
    {
      path: 'editar', // Esta será '/comunicados/nuevo-comunicado'
      component: EditarDifusionComponent
  },
  ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(DifusionesRoutes)
  ],
  exports: [RouterModule]
})
export class DifusionesRoutingModule { }
