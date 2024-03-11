import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReunionesComponent } from './reuniones.component';
import { NuevaReunionComponent } from './nueva-reunion/nueva-reunion.component';

const ReunionesRoutes: Routes = [
  {
    path: '',
    component: ReunionesComponent,
  },
  {
    path: 'nueva-reunion',
    component: NuevaReunionComponent
   },
];

@NgModule({
  imports: [
    RouterModule.forChild(ReunionesRoutes)
  ],
  exports: [RouterModule]
})
export class ReunionesRoutingModule { }
