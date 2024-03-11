import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesComponent } from './notificaciones.component';
import { NotAvisosComponent } from './not-avisos/not-avisos.component';
import { NotDocumentacionComponent } from './not-documentacion/not-documentacion.component';
import { NotEntrevistasComponent } from './not-entrevistas/not-entrevistas.component';
import { NotFaltasComponent } from './not-faltas/not-faltas.component';
import { NotFamiliaresComponent } from './not-familiares/not-familiares.component';
import { NotPedagogicasComponent } from './not-pedagogicas/not-pedagogicas.component';
import { NotRetirosComponent } from './not-retiros/not-retiros.component';
import { NotReunionesComponent } from './not-reuniones/not-reuniones.component';
import { NotSancionesComponent } from './not-sanciones/not-sanciones.component';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { NotificacionesRoutingModule } from './notificaciones-routing';



@NgModule({
  declarations: [
    NotificacionesComponent,
    NotAvisosComponent,
    NotDocumentacionComponent,
    NotEntrevistasComponent,
    NotFaltasComponent,
    NotFamiliaresComponent,
    NotPedagogicasComponent,
    NotRetirosComponent,
    NotReunionesComponent,
    NotSancionesComponent
  ],
  imports: [
    CommonModule,
    CompartidoModule,
    NotificacionesRoutingModule
  ]
})
export class NotificacionesModule { }
