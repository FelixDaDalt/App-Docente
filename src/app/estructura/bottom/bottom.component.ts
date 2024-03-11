import { Component } from '@angular/core';
import { HomeService } from '../../componentes/home/home.service';
import { notificacionHome } from '../../componentes/home/home';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.css']
})
export class BottomComponent {


  notificacionesHome?:notificacionHome
  usuarioDatos?:usuarioDatos | null

  constructor(private homeService:HomeService,
     private datosUsuario:DatosUsuarioService,
     private router:Router){
    this.obtenerNotificaciones()
    this.obtenerUsuario()
  }

  obtenerNotificaciones(){
    this.homeService.getHomeDatosNotificacionesObservable().subscribe({
      next:(notificaciones)=>{
        if(notificaciones)
          this.notificacionesHome = notificaciones
      }
    })
  }

  obtenerUsuario(){
    this.datosUsuario.obtenerDatos().subscribe({
      next:(usuarioDatos)=>{
        this.usuarioDatos = usuarioDatos
      }
    })
  }


}
