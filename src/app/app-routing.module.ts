import { ResultadoBusquedaComponent } from './componentes/resultado-busqueda/resultado-busqueda.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginSeleccionComponent } from './componentes/login/institucion-seleccion/institucion-seleccion.component';
import { ComunicadosComponent } from './componentes/comunicados/comunicados.component';
import { NotificacionesComponent } from './componentes/notificaciones/notificaciones.component';
import { NotEntrevistasComponent } from './componentes/notificaciones/not-entrevistas/not-entrevistas.component';
import { NotAvisosComponent } from './componentes/notificaciones/not-avisos/not-avisos.component';
import { NotFamiliaresComponent } from './componentes/notificaciones/not-familiares/not-familiares.component';
import { NotPedagogicasComponent } from './componentes/notificaciones/not-pedagogicas/not-pedagogicas.component';
import { NotSancionesComponent } from './componentes/notificaciones/not-sanciones/not-sanciones.component';
import { NotFaltasComponent } from './componentes/notificaciones/not-faltas/not-faltas.component';
import { NotDocumentacionComponent } from './componentes/notificaciones/not-documentacion/not-documentacion.component';
import { AsistenciaComponent } from './componentes/asistencia/asistencia.component';
import { MensajeriaComponent } from './componentes/mensajeria/mensajeria.component';
import { MensajeriaHistorialComponent } from './componentes/mensajeria/mensajeria-historial/mensajeria-historial.component';
import { NuevoComunicadoComponent } from './componentes/comunicados/nuevo-comunicado/nuevo-comunicado.component';
import { ComunicadosEnviadosComponent } from './componentes/comunicados/comunicados-enviados/comunicados-enviados.component';
import { NotRetirosComponent } from './componentes/notificaciones/not-retiros/not-retiros.component';
import { LibroTemaComponent } from './componentes/libro-tema/libro-tema.component';
import { CalificacionComponent } from './componentes/calificacion/calificacion-nuevo-instrumento/calificacion.component';
import { CalificacionNotasComponent } from './componentes/calificacion/calificacion-notas/calificacion-notas.component';
import { CalificacionInstrumentosComponent } from './componentes/calificacion/calificacion-instrumentos/calificacion-instrumentos.component';
import { EstudianteLegajoComponent } from './componentes/resultado-busqueda/estudiante-legajo/estudiante-legajo.component';
import { MateriasComponent } from './componentes/materias/materias.component';
import { ReunionesComponent } from './componentes/reuniones/reuniones.component';
import { NotReunionesComponent } from './componentes/notificaciones/not-reuniones/not-reuniones.component';
import { NuevaReunionComponent } from './componentes/reuniones/nueva-reunion/nueva-reunion.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' }, // Ruta por defecto, redirige a 'login'
  { path: 'home', component: HomeComponent }, // Ruta 'home', carga 'HomeComponent'
  { path: 'login', component: LoginComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'seleccion', component: LoginSeleccionComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'comunicados', component: ComunicadosComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones', component: NotificacionesComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/entrevistas', component: NotEntrevistasComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/avisos', component: NotAvisosComponent }, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/familiares', component: NotFamiliaresComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/pedagogicas', component: NotPedagogicasComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/sanciones', component: NotSancionesComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/faltas', component: NotFaltasComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/documentacion', component: NotDocumentacionComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/retiros', component: NotRetirosComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'notificaciones-detalles/reuniones', component: NotReunionesComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'asistencia', component: AsistenciaComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'asistencia/:fecha/:id', component: AsistenciaComponent },
  { path: 'mensajeria', component: MensajeriaComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'mensajeria-historial', component: MensajeriaHistorialComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'nuevo-comunicado', component: NuevoComunicadoComponent}, // Ruta 'login', carga 'LoginComponent'
  { path: 'comunicados-enviados', component: ComunicadosEnviadosComponent},
  { path: 'libro-temas', component: LibroTemaComponent},
  { path: 'calificacion', component: CalificacionInstrumentosComponent},
  { path: 'calificacion-nuevo-instrumento', component: CalificacionComponent},
  { path: 'calificacion-nuevo-instrumento/:edit?', component: CalificacionComponent},
  { path: 'calificacion-notas', component: CalificacionNotasComponent},
  { path: 'resultado/:termino', component: ResultadoBusquedaComponent},
  { path: 'legajo-alumno', component: EstudianteLegajoComponent},
  { path: 'materia', component: MateriasComponent},
  { path: 'reuniones', component: ReunionesComponent},
  { path: 'nueva-reunion', component: NuevaReunionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
