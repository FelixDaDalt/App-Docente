import { DifusionesModule } from './../componentes/difusiones/difusiones.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';



const ComunicadosRoutes: Routes = [

  {
    path:'',
    component:DashboardComponent,
    children:[
      { path: '',
      loadChildren: () => import('../componentes/home/home.module').then(m => m.HomeModule)
      },
      { path: 'legajo-alumno',
      loadChildren: () => import('../componentes/estudiante-legajo/estudiante-legajo.module').then(m => m.EstudianteLegajoModule)
      },
      { path: 'resultado',
        loadChildren: () => import('../componentes/resultado-busqueda/resultado-busqueda.module').then(m => m.ResultadoBusquedaModule)
      },
      { path: 'materia',

        loadChildren: () => import('../componentes/materias/materias.module').then(m => m.MateriasModule)
      },
      { path: 'reuniones',

        loadChildren: () => import('../componentes/reuniones/reuniones.module').then(m => m.ReunionesModule)
      },
      { path: 'comunicados',
        loadChildren: () => import('../componentes/comunicados/comunicados.module').then(m => m.ComunicadosModule)
      },
      { path: 'notificaciones',

      loadChildren: () => import('../componentes/notificaciones/notificaciones.module').then(m => m.NotificacionesModule)
      },
      { path: 'asistencia',

      loadChildren: () => import('../componentes/asistencia/asistencia.module').then(m => m.AsistenciaModule)
      },
      { path: 'calificacion',

      loadChildren: () => import('../componentes/calificacion/calificacion.module').then(m => m.CalificacionModule)
      },
      { path: 'libro-temas',

      loadChildren: () => import('../componentes/libro-tema/libro-tema.module').then(m => m.LibroTemaModule)
      },
      { path: 'mensajeria',

      loadChildren: () => import('./mensajeria/mensajeria.module').then((m) => m.MensajeriaModule)
      },
      { path: 'nosotros',

      loadChildren: () => import('../componentes/nosotros/nosotros.module').then(m => m.NosotrosModule)
      },
      { path: 'tutoriales',
      loadChildren: () => import('../componentes/tutoriales/tutoriales.module').then(m => m.TutorialesModule)
      },
      { path: 'difusiones',
        loadChildren: () => import('../componentes/difusiones/difusiones.module').then(m => m.DifusionesModule)
        }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ComunicadosRoutes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
