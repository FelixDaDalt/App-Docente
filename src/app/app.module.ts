import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './estructura/header/header.component';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './componentes/home/home.component';
import { BottomComponent } from './estructura/bottom/bottom.component';
import { SidebarComponent } from './estructura/sidebar/sidebar.component';
import { LoginComponent } from './componentes/login/login.component';
import { LoginSeleccionComponent } from './componentes/login/institucion-seleccion/institucion-seleccion.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { DatePipe } from '@angular/common';
import { NgxSplideModule } from 'ngx-splide';
import { BotonWhatsappComponent } from './componentes/home/boton-whatsapp/boton-whatsapp.component';
import { RolSeleccionComponent } from './componentes/login/rol-seleccion/rol-seleccion.component';
import { NotificacionPopupComponent } from './otros/notificacion-popup/notificacion-popup.component';
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
import { RequestInterceptorInterceptor } from './Interceptor/request-interceptor.interceptor';
import { SpinnerComponent } from './otros/spinner/spinner.component';
import { DestinatariosComponent } from './componentes/mensajeria/destinatarios/destinatarios.component';
import { MensajeriaNuevoChatComponent } from './componentes/mensajeria/mensajeria-nuevo-chat/mensajeria-nuevo-chat.component';
import { FechaYhoraComponent } from './otros/fecha-yhora/fecha-yhora.component';
import { TituloComponent } from './otros/titulo/titulo.component';
import { NuevoComunicadoComponent } from './componentes/comunicados/nuevo-comunicado/nuevo-comunicado.component';
import { MensajeInformacionComponent } from './componentes/mensajeria/mensaje-informacion/mensaje-informacion.component';
import { ComunicadosEnviadosComponent } from './componentes/comunicados/comunicados-enviados/comunicados-enviados.component';
import { ComunicadosEnviadosDestinatariosComponent } from './componentes/comunicados/comunicados-enviados/comunicados-enviados-destinatarios/comunicados-enviados-destinatarios.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotRetirosComponent } from './componentes/notificaciones/not-retiros/not-retiros.component';
import { LibroTemaComponent } from './componentes/libro-tema/libro-tema.component';
import { AusentesComponent } from './componentes/libro-tema/ausentes/ausentes.component';
import { AsistenciaInformacionComponent } from './componentes/asistencia/asistencia-informacion/asistencia-informacion.component';
import { CalificacionComponent } from './componentes/calificacion/calificacion-nuevo-instrumento/calificacion.component';
import { CalificacionNotasComponent } from './componentes/calificacion/calificacion-notas/calificacion-notas.component';
import { CalificacionInstrumentosComponent } from './componentes/calificacion/calificacion-instrumentos/calificacion-instrumentos.component';
import { ResultadoBusquedaComponent } from './componentes/resultado-busqueda/resultado-busqueda.component';
import { EstudianteLegajoComponent } from './componentes/resultado-busqueda/estudiante-legajo/estudiante-legajo.component';
import { EstudianteLegajoLegajoComponent } from './componentes/resultado-busqueda/estudiante-legajo/estudiante-legajo-legajo/estudiante-legajo-legajo.component';
import { EstudianteLegajoModalComponent } from './componentes/resultado-busqueda/estudiante-legajo/estudiante-legajo-legajo/estudiante-legajo-modal/estudiante-legajo-modal.component';
import { MateriasComponent } from './componentes/materias/materias.component';
import { MateriasInformacionComponent } from './componentes/materias/materias-informacion/materias-informacion.component';
import { MateriasLibroTemasComponent } from './componentes/materias/materias-libro-temas/materias-libro-temas.component';
import { MateriasCalificacionesComponent } from './componentes/materias/materias-calificaciones/materias-calificaciones.component';
import { MateriasAlumnosComponent } from './componentes/materias/materias-alumnos/materias-alumnos.component';
import { MateriasParteAsistenciaComponent } from './componentes/materias/materias-parte-asistencia/materias-parte-asistencia.component';
import { EstudianteLegajoInasistenciaComponent } from './componentes/resultado-busqueda/estudiante-legajo/estudiante-legajo-inasistencia/estudiante-legajo-inasistencia.component';
import { EstudianteLegajoAcademicoComponent } from './componentes/resultado-busqueda/estudiante-legajo/estudiante-legajo-academico/estudiante-legajo-academico.component';
import { EstudianteLegajoInformacionComponent } from './componentes/resultado-busqueda/estudiante-legajo/estudiante-legajo-informacion/estudiante-legajo-informacion.component';
import { ReunionesComponent } from './componentes/reuniones/reuniones.component';
import { NotReunionesComponent } from './componentes/notificaciones/not-reuniones/not-reuniones.component';
import { NuevaReunionComponent } from './componentes/reuniones/nueva-reunion/nueva-reunion.component';
import { ReagendarReunionComponent } from './componentes/reuniones/reagendar-reunion/reagendar-reunion.component';



registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    BottomComponent,
    SidebarComponent,
    LoginComponent,
    LoginSeleccionComponent,
    BotonWhatsappComponent,
    RolSeleccionComponent,
    NotificacionPopupComponent,
    ComunicadosComponent,
    NotificacionesComponent,
    NotEntrevistasComponent,
    NotAvisosComponent,
    NotFamiliaresComponent,
    NotPedagogicasComponent,
    NotSancionesComponent,
    NotFaltasComponent,
    NotDocumentacionComponent,
    AsistenciaComponent,
    MensajeriaComponent,
    MensajeriaHistorialComponent,
    SpinnerComponent,
    DestinatariosComponent,
    MensajeriaNuevoChatComponent,
    FechaYhoraComponent,
    TituloComponent,
    NuevoComunicadoComponent,
    MensajeInformacionComponent,
    ComunicadosEnviadosComponent,
    ComunicadosEnviadosDestinatariosComponent,
    NotRetirosComponent,
    LibroTemaComponent,
    AusentesComponent,
    AsistenciaInformacionComponent,
    CalificacionComponent,
    CalificacionNotasComponent,
    CalificacionInstrumentosComponent,
    ResultadoBusquedaComponent,
    EstudianteLegajoComponent,
    EstudianteLegajoLegajoComponent,
    EstudianteLegajoModalComponent,
    MateriasComponent,
    MateriasInformacionComponent,
    MateriasLibroTemasComponent,
    MateriasCalificacionesComponent,
    MateriasAlumnosComponent,
    MateriasParteAsistenciaComponent,
    EstudianteLegajoInasistenciaComponent,
    EstudianteLegajoAcademicoComponent,
    EstudianteLegajoInformacionComponent,
    ReunionesComponent,
    NotReunionesComponent,
    NuevaReunionComponent,
    ReagendarReunionComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    HttpClientModule,
    FormsModule,
    NgxSplideModule,
    NgbModule
  ],
  providers: [DatePipe,
  { provide: LOCALE_ID, useValue: 'es' },
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorInterceptor, multi: true }],

  bootstrap: [AppComponent]
})
export class AppModule { }
