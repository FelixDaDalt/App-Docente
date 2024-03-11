import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificacionesComponent } from './notificaciones.component';
import { NotFaltasComponent } from './not-faltas/not-faltas.component';
import { NotFamiliaresComponent } from './not-familiares/not-familiares.component';
import { NotPedagogicasComponent } from './not-pedagogicas/not-pedagogicas.component';
import { NotRetirosComponent } from './not-retiros/not-retiros.component';
import { NotReunionesComponent } from './not-reuniones/not-reuniones.component';
import { NotSancionesComponent } from './not-sanciones/not-sanciones.component';
import { NotAvisosComponent } from './not-avisos/not-avisos.component';
import { NotDocumentacionComponent } from './not-documentacion/not-documentacion.component';
import { NotEntrevistasComponent } from './not-entrevistas/not-entrevistas.component';


const NotificacionesRoutes: Routes = [
  {
    path: '',
    component: NotificacionesComponent,
  },
  {
    path: 'avisos',
    component: NotAvisosComponent
   },
   {
    path: 'documentacion',
    component: NotDocumentacionComponent
   },
   {
    path: 'entrevistas',
    component: NotEntrevistasComponent
   },
  {
    path: 'faltas',
    component: NotFaltasComponent
   },
   {
    path: 'familiares',
    component: NotFamiliaresComponent
   },
   {
    path: 'pedagogicas',
    component: NotPedagogicasComponent
   },
   {
    path: 'retiros',
    component: NotRetirosComponent
   },
   {
    path: 'reuniones',
    component: NotReunionesComponent
   },
   {
    path: 'sanciones',
    component: NotSancionesComponent
   },

];

@NgModule({
  imports: [
    RouterModule.forChild(NotificacionesRoutes)
  ],
  exports: [RouterModule]
})
export class NotificacionesRoutingModule { }
