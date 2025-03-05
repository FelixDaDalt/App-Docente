import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComunicadosEnviadosComponent } from './comunicados-enviados/comunicados-enviados.component';
import { NuevoComunicadoComponent } from './nuevo-comunicado/nuevo-comunicado.component';
import { ComunicadosRecibidosComponent } from './comunicados-recibidos/comunicados-recibidos.component';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { ComunicadosComponent } from './comunicados.component';


const ComunicadosRoutes: Routes = [
  {
    path: '', // Esta será '/comunicados/comunicados-recibidos'
    component: ComunicadosComponent,
    children:[
      {
        path: 'comunicados-recibidos', // Esta será '/comunicados/comunicados-recibidos'
        component: ComunicadosRecibidosComponent
      },
      {
        path: 'nuevo-comunicado', // Esta será '/comunicados/nuevo-comunicado'
        component: NuevoComunicadoComponent
      },
      {
        path: 'comunicados-enviados', // Esta será '/comunicados/comunicados-enviados'
        component: ComunicadosEnviadosComponent
      }
    ]
  },


];

@NgModule({
  imports: [
    RouterModule.forChild(ComunicadosRoutes)
  ],
  exports: [RouterModule]
})
export class ComunicadosRoutingModule { }
