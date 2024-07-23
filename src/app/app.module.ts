import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { DatePipe } from '@angular/common';


import { RequestInterceptorInterceptor } from './Interceptor/request-interceptor.interceptor';
import { CompartidoModule } from './compartido/compartido.module';
import { VersionModalComponent } from './servicios/version/version-modal/version-modal.component';
import { VersionModule } from './servicios/version/version.module';
import { UserParamsInterceptor } from './Interceptor/UserParamsInterceptor';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    VersionModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule

  ],
  providers: [DatePipe,
  { provide: LOCALE_ID, useValue: 'es' },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: UserParamsInterceptor,
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorInterceptor, multi: true },
 ],

  bootstrap: [AppComponent]
})
export class AppModule { }
