import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../otros/spinner/spinner.component';
import { TituloComponent } from '../otros/titulo/titulo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FechaYhoraComponent } from '../otros/fecha-yhora/fecha-yhora.component';
import { IonicModule } from '@ionic/angular';
import { NgxSplideModule } from 'ngx-splide';
import { ErrorFormulariosComponent } from './error-formularios/error-formularios.component';
import { ErrorFormulariosPipe } from './error-formularios.pipe';




@NgModule({
  declarations: [
    SpinnerComponent,
    TituloComponent,
    FechaYhoraComponent,
    ErrorFormulariosComponent,
    ErrorFormulariosPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    IonicModule.forRoot(),
    NgxSplideModule,
    ReactiveFormsModule,
  ],
  exports:[
    SpinnerComponent,
    TituloComponent,
    FechaYhoraComponent,
    FormsModule,
    NgbModule,
    IonicModule,
    NgxSplideModule,
    ReactiveFormsModule,
    ErrorFormulariosComponent,
    ErrorFormulariosPipe
  ]
})
export class CompartidoModule { }
