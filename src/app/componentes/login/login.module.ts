import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { LoginComponent } from './login/login.component';
import { RolSeleccionComponent } from './rol-seleccion/rol-seleccion.component';
import { LoginSeleccionComponent } from './institucion-seleccion/institucion-seleccion.component';
import { LoginRoutingModule } from './Login-routing';
import { LogueoComponent } from './logueo.component';



@NgModule({
  declarations: [
    LoginComponent,
    LoginSeleccionComponent,
    RolSeleccionComponent,
    LogueoComponent,
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
