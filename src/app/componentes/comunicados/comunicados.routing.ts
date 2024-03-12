import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComunicadosComponent } from './comunicados.component';
import { ComunicadosEnviadosComponent } from './comunicados-enviados/comunicados-enviados.component';
import { NuevoComunicadoComponent } from './nuevo-comunicado/nuevo-comunicado.component';


const ComunicadosRoutes: Routes = [
  {
    path: '',
    component: ComunicadosComponent,
  },
  {
    path: 'nuevo-comunicado',
    component: NuevoComunicadoComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ComunicadosRoutes)
  ],
  exports: [RouterModule]
})
export class ComunicadosRoutingModule { }
