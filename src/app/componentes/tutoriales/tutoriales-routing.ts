import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialesComponent } from './tutoriales/tutoriales.component';


const TutorialesRoutes: Routes = [
  {
    path: '',
    component: TutorialesComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(TutorialesRoutes)
  ],
  exports: [RouterModule]
})
export class TutorialesRoutingModule { }
