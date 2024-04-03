import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.routing';
import { CompartidoModule } from 'src/app/compartido/compartido.module';
import { DashboardComponent } from './dashboard.component';
import { BottomComponent } from './estructura/bottom/bottom.component';
import { HeaderComponent } from './estructura/header/header.component';
import { SidebarComponent } from './estructura/sidebar/sidebar.component';
import { NotificacionPopupComponent } from '../otros/notificacion-popup/notificacion-popup.component';




@NgModule({
  declarations: [DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    BottomComponent,
    NotificacionPopupComponent],
  imports: [
    CommonModule,
    CompartidoModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
