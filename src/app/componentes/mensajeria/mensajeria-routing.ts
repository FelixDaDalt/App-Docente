import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MensajeriaComponent } from './mensajeria.component';
import { MensajeriaHistorialComponent } from './mensajeria-historial/mensajeria-historial.component';


const MensajeriaRoutes: Routes = [
  {
    path: '',
    component: MensajeriaComponent,
  },
  { path: 'mensajeria-historial',
  component: MensajeriaHistorialComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(MensajeriaRoutes)
  ],
  exports: [RouterModule]
})
export class MensajeriaRoutingModule { }
