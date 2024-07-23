import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MateriasComponent } from './materias.component';


const MateriasRoutes: Routes = [
  {
    path: ':id',
    component: MateriasComponent,
  },
  {
    path: '',
    component: MateriasComponent,
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(MateriasRoutes)
  ],
  exports: [RouterModule]
})
export class MateriasRoutingModule { }
