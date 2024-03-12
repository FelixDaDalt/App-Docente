import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { LoginSeleccionComponent } from './componentes/login/institucion-seleccion/institucion-seleccion.component';
import { ComunicadosEnviadosComponent } from './componentes/comunicados/comunicados-enviados/comunicados-enviados.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' }, // Ruta por defecto, redirige a 'login'

  { path: 'login', component: LoginComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'seleccion', component: LoginSeleccionComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'comunicados-enviados', component: ComunicadosEnviadosComponent },

  /*{ path: 'usuario',
  loadChildren: () => import('./componentes/usuario/usuario.module').then(m => m.UsuarioModule)
  },*/
  { path: 'legajo-alumno',
  loadChildren: () => import('./componentes/estudiante-legajo/estudiante-legajo.module').then(m => m.EstudianteLegajoModule)
  },
  { path: 'resultado',
    loadChildren: () => import('./componentes/resultado-busqueda/resultado-busqueda.module').then(m => m.ResultadoBusquedaModule)
  },
  { path: 'materia',
    loadChildren: () => import('./componentes/materias/materias.module').then(m => m.MateriasModule)
  },
  { path: 'reuniones',
    loadChildren: () => import('./componentes/reuniones/reuniones.module').then(m => m.ReunionesModule)
  },
  { path: 'comunicados',
    loadChildren: () => import('./componentes/comunicados/comunicados.module').then(m => m.ComunicadosModule)
  },
  { path: 'notificaciones',
  loadChildren: () => import('./componentes/notificaciones/notificaciones.module').then(m => m.NotificacionesModule)
  },
  { path: 'asistencia',
  loadChildren: () => import('./componentes/asistencia/asistencia.module').then(m => m.AsistenciaModule)
  },
  { path: 'calificacion',
  loadChildren: () => import('./componentes/calificacion/calificacion.module').then(m => m.CalificacionModule)
  },
  { path: 'libro-temas',
  loadChildren: () => import('./componentes/libro-tema/libro-tema.module').then(m => m.LibroTemaModule)
  },
  { path: 'home',
  loadChildren: () => import('./componentes/home/home.module').then(m => m.HomeModule)
  },
  { path: 'mensajeria',
  loadChildren: () => import('./componentes/mensajeria/mensajeria.module').then(m => m.MensajeriaModule)
  },
  { path: 'nosotros',
  loadChildren: () => import('./componentes/nosotros/nosotros.module').then(m => m.NosotrosModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
