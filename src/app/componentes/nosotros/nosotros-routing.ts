import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NosotrosComponent } from './nosotros/nosotros.component';

const NosotrosRoutes: Routes = [
  {
    path: '',
    component: NosotrosComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(NosotrosRoutes)
  ],
  exports: [RouterModule]
})
export class NosotrosRoutingModule { }
