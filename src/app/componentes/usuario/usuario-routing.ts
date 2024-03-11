import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from './usuario/usuario.component';

const usuarioRoutes: Routes = [
  {
    path: '',
    component: UsuarioComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(usuarioRoutes)
  ],
  exports: [RouterModule]
})
export class usuarioRoutingModule { }
