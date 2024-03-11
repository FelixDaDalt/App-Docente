import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { HomeRoutingModule } from './home-routing';
import { BotonWhatsappComponent } from './boton-whatsapp/boton-whatsapp.component';



@NgModule({
  declarations: [
    HomeComponent,
    BotonWhatsappComponent],
  imports: [
    CommonModule,
    CompartidoModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
