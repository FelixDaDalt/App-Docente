import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinatariosComponent } from './destinatarios/destinatarios.component';
import { MensajeInformacionComponent } from './mensaje-informacion/mensaje-informacion.component';
import { MensajeriaHistorialComponent } from './mensajeria-historial/mensajeria-historial.component';
import { MensajeriaNuevoChatComponent } from './mensajeria-nuevo-chat/mensajeria-nuevo-chat.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { MensajeriaRoutingModule } from './mensajeria-routing';
import { MensajeriaComponent } from './mensajeria.component';



@NgModule({
  declarations: [
    DestinatariosComponent,
    MensajeInformacionComponent,
    MensajeriaHistorialComponent,
    MensajeriaNuevoChatComponent,
    MensajeriaComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    MensajeriaRoutingModule
  ]
})
export class MensajeriaModule { }
