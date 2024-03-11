import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './estructura/header/header.component';

import { BottomComponent } from './estructura/bottom/bottom.component';
import { SidebarComponent } from './estructura/sidebar/sidebar.component';
import { LoginComponent } from './componentes/login/login.component';
import { LoginSeleccionComponent } from './componentes/login/institucion-seleccion/institucion-seleccion.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { RolSeleccionComponent } from './componentes/login/rol-seleccion/rol-seleccion.component';
import { NotificacionPopupComponent } from './otros/notificacion-popup/notificacion-popup.component';
import { RequestInterceptorInterceptor } from './Interceptor/request-interceptor.interceptor';
import { CompartidoModule } from './compartido/compartido.module';
import { VersionModalComponent } from './servicios/version/version-modal/version-modal.component';



registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BottomComponent,
    SidebarComponent,
    LoginComponent,
    LoginSeleccionComponent,
    RolSeleccionComponent,
    NotificacionPopupComponent,
    VersionModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CompartidoModule

  ],
  providers: [DatePipe,
  { provide: LOCALE_ID, useValue: 'es' },
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorInterceptor, multi: true }],

  bootstrap: [AppComponent]
})
export class AppModule { }
