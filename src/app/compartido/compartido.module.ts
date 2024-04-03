import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../otros/spinner/spinner.component';
import { TituloComponent } from '../otros/titulo/titulo.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FechaYhoraComponent } from '../otros/fecha-yhora/fecha-yhora.component';
import { IonicModule } from '@ionic/angular';
import { NgxSplideModule } from 'ngx-splide';
import { HeaderComponent } from '../dashboard/estructura/header/header.component';
import { SidebarComponent } from '../dashboard/estructura/sidebar/sidebar.component';
import { BottomComponent } from '../dashboard/estructura/bottom/bottom.component';




@NgModule({
  declarations: [
    SpinnerComponent,
    TituloComponent,
    FechaYhoraComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    IonicModule.forRoot(),
    NgxSplideModule
  ],
  exports:[
    SpinnerComponent,
    TituloComponent,
    FechaYhoraComponent,
    FormsModule,
    NgbModule,
    IonicModule,
    NgxSplideModule,

  ]
})
export class CompartidoModule { }
