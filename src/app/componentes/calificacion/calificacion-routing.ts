import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalificacionNuevoComponent } from './calificacion-nuevo-instrumento/calificacionNuevo.component';
import { CalificacionInstrumentosComponent } from './calificacion-instrumentos/calificacion-instrumentos.component';
import { CalificacionNotasComponent } from './calificacion-notas/calificacion-notas.component';
import { CalificacionComponent } from './calificacion.component';


const CalificacionesRoutes: Routes = [
  {
    path: '',
    component: CalificacionComponent,
    children:[
      {
        path:'calificacion-nuevo-instrumento',
        component: CalificacionNuevoComponent
      },
      {
        path: 'calificacion-nuevo-instrumento/:id',
        component: CalificacionNuevoComponent
       },
       { path: 'calificacion-notas/:idMateria/:tipoMateria/:idOperacion',
        component: CalificacionNotasComponent
      },
      {
        path: ':id',
        component: CalificacionInstrumentosComponent
       },
       {
        path: '',
        component: CalificacionInstrumentosComponent
       },
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(CalificacionesRoutes)
  ],
  exports: [RouterModule]
})
export class CalificacionesRoutingModule { }
