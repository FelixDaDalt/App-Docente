import { Component, OnDestroy, OnInit } from '@angular/core';
import { home } from 'src/app/componentes/home/home';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { HomeService } from './home.service';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{

  suscripcionUsuario?:Subscription
  suscripcionDatosHome?:Subscription

  usuario!:usuarioDatos
  datosHome!:home
  isTextTruncated: boolean = true;
  expandedCardIndex: number = -1

  constructor(private datosUsuarioService:DatosUsuarioService,
    private homeService:HomeService){ }

  ngOnInit(): void {
    this.obtenerUsuario()
    this.obtenerDatosHome()
  }

  ngOnDestroy() {
    this.suscripcionDatosHome?.unsubscribe()
    this.suscripcionUsuario?.unsubscribe()
  }

  obtenerUsuario(){
    if(this.suscripcionUsuario){
      this.suscripcionUsuario.unsubscribe()
    }

    this.suscripcionUsuario = this.datosUsuarioService.obtenerDatos()
    .subscribe({
      next:(usuario)=>{
        if(usuario){
          this.usuario = usuario
        }
      }
    })
  }

  obtenerDatosHome(){
    if(this.suscripcionDatosHome){
      this.suscripcionDatosHome.unsubscribe()
    }

    this.suscripcionDatosHome = this.homeService.getHomeDatosObservable()
    .subscribe({
      next:(datosHome)=>{
        if(datosHome)
          this.datosHome = datosHome
      }
    })
  }


  toggleText(index: number) {
    if (this.expandedCardIndex === index) {
      this.expandedCardIndex = -1; // Si se hace clic en la tarjeta ya expandida, la contrae
    } else {
      this.expandedCardIndex = index; // Si se hace clic en una nueva tarjeta, la expande
    }
  }

}
