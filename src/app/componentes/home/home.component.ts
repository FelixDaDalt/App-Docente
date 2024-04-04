import { Component, OnDestroy, OnInit } from '@angular/core';
import { home } from 'src/app/componentes/home/home';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { HomeService } from './home.service';
import { Observable, Subscription, of, tap} from 'rxjs';
import { VersionService } from 'src/app/servicios/version/version.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{

  suscripcionUsuario?:Subscription
  suscripcionDatosHome?:Subscription

  usuario$:Observable<usuarioDatos | null> = of(null)
  datosHome$:Observable<home | null>=of(null)

  isTextTruncated: boolean = true;
  expandedCardIndex: number = -1

  constructor(private datosUsuarioService:DatosUsuarioService,
    private homeService:HomeService,
    private version:VersionService){ }

  ngOnInit(): void {
    this.version.comprobarVersion()
    this.suscripcionUsuario = this.obtenerUsuario().subscribe()
    this.suscripcionDatosHome = this.obtenerDatosHome().subscribe()
  }

  ngOnDestroy() {
    this.suscripcionDatosHome?.unsubscribe()
    this.suscripcionUsuario?.unsubscribe()
  }

  //OK
  obtenerUsuario(){
    return this.datosUsuarioService.obtenerDatos()
    .pipe(
      tap(usuario => this.usuario$ = of(usuario))
    )
  }

  //OK
  obtenerDatosHome(){
    return this.homeService.getHomeDatosObservable().pipe(
    tap(datosHome=>{
      this.datosHome$ = of(datosHome)})
    )
  }

  //OK
  toggleText(index: number) {
    if (this.expandedCardIndex === index) {
      this.expandedCardIndex = -1; // Si se hace clic en la tarjeta ya expandida, la contrae
    } else {
      this.expandedCardIndex = index; // Si se hace clic en una nueva tarjeta, la expande
    }
  }

}
