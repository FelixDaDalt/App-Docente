import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from '../../../componentes/home/home.service';
import { notificacionHome } from '../../../componentes/home/home';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.css']
})
export class BottomComponent implements OnInit,OnDestroy{


  notificacionesHome?:notificacionHome
  usuarioDatos?:usuarioDatos | null

  suscripcionNotificacion?:Subscription
  suscripcionUsuarioDatos?:Subscription

  constructor(private homeService:HomeService,
     private datosUsuario:DatosUsuarioService,
     private router: Router){

  }
  ngOnInit(): void {
    this.obtenerNotificaciones()
    this.obtenerUsuario()
  }

  ngOnDestroy(): void {
    this.suscripcionNotificacion?.unsubscribe()
    this.suscripcionUsuarioDatos?.unsubscribe()
  }

  obtenerNotificaciones(){
   this.suscripcionNotificacion = this.homeService.getHomeDatosNotificacionesObservable().subscribe({
      next:(notificaciones)=>{
        if(notificaciones)
          this.notificacionesHome = notificaciones
      }
    })
  }

  obtenerUsuario(){
   this.suscripcionUsuarioDatos = this.datosUsuario.obtenerDatos().subscribe({
      next:(usuarioDatos)=>{
        this.usuarioDatos = usuarioDatos
      }
    })
  }



  navegarRuta(ruta:string,ruta2?:string){
    if(ruta2)
    this.router.navigate(['dashboard',ruta,ruta2])
    else
    this.router.navigate(['dashboard',ruta])
  }

}
