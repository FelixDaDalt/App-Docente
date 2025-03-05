import { ComunicadosEnviadosComponent } from './comunicados-enviados/comunicados-enviados.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { ComunicadosEnviadosDestinatariosComponent } from './comunicados-enviados/comunicados-enviados-destinatarios/comunicados-enviados-destinatarios.component';
import { ComunicadosRecibidosComponent } from './comunicados-recibidos/comunicados-recibidos.component';
import { ComunicadosRoutingModule } from './comunicados.routing';
import { NuevoComunicadoComponent } from './nuevo-comunicado/nuevo-comunicado.component';
import { ComunicadosComponent } from './comunicados.component';



@NgModule({
  declarations: [
    ComunicadosRecibidosComponent,
    NuevoComunicadoComponent,
    ComunicadosEnviadosComponent,
    ComunicadosEnviadosDestinatariosComponent,
    ComunicadosComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    ComunicadosRoutingModule
  ]
})
export class ComunicadosModule { }
