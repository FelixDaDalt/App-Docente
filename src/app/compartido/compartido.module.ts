import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../otros/spinner/spinner.component';
import { TituloComponent } from '../otros/titulo/titulo.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FechaYhoraComponent } from '../otros/fecha-yhora/fecha-yhora.component';
import { IonicModule } from '@ionic/angular';
import { NgxSplideModule } from 'ngx-splide';



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
    NgxSplideModule,
  ],
  exports:[
    SpinnerComponent,
    TituloComponent,
    FechaYhoraComponent,
    FormsModule,
    NgbModule,
    IonicModule,
    NgxSplideModule
  ]
})
export class CompartidoModule { }
