import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario/usuario.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { usuarioRoutingModule } from './usuario-routing';



@NgModule({
  declarations: [
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    usuarioRoutingModule
  ]
})
export class UsuarioModule { }
