import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalificacionComponent } from './calificacion-nuevo-instrumento/calificacion.component';
import { CalificacionInstrumentosComponent } from './calificacion-instrumentos/calificacion-instrumentos.component';
import { CalificacionNotasComponent } from './calificacion-notas/calificacion-notas.component';


const CalificacionesRoutes: Routes = [
  {
    path: '',
    component: CalificacionInstrumentosComponent,
  },
  {
    path: 'calificacion-nuevo-instrumento',
    component: CalificacionComponent
   },
   {
    path:'calificacion-nuevo-instrumento/:edit?',
    component: CalificacionComponent
   },
   { path: 'calificacion-notas',
    component: CalificacionNotasComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(CalificacionesRoutes)
  ],
  exports: [RouterModule]
})
export class CalificacionesRoutingModule { }
