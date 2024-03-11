import { ComunicadosEnviadosComponent } from './comunicados-enviados/comunicados-enviados.component';
import { ComunicadosComponent } from './comunicados.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoComunicadoComponent } from './nuevo-comunicado/nuevo-comunicado.component';
import { ComunicadosEnviadosDestinatariosComponent } from './comunicados-enviados/comunicados-enviados-destinatarios/comunicados-enviados-destinatarios.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { ComunicadosRoutingModule } from './comunicados.routing';



@NgModule({
  declarations: [
    ComunicadosComponent,
    NuevoComunicadoComponent,
    ComunicadosEnviadosComponent,
    ComunicadosEnviadosDestinatariosComponent],
  imports: [
    CommonModule,
    CompartidoModule,
    ComunicadosRoutingModule
  ]
})
export class ComunicadosModule { }
