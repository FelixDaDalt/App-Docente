import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginSeleccionComponent } from './institucion-seleccion/institucion-seleccion.component';
import { RolSeleccionComponent } from './rol-seleccion/rol-seleccion.component';
import { LogueoComponent } from './logueo.component';

const LoginRoutes: Routes = [
  {
    path: '',
    component: LogueoComponent,
    children:[
      {
        path:'',
        component:LoginComponent
      },
      {
        path:'seleccion-institucion',
        component:LoginSeleccionComponent
      },
      {
        path:'seleccion-rol',
        component:RolSeleccionComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(LoginRoutes)
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
