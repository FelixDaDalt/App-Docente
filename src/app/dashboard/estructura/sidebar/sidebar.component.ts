import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { materias } from 'src/app/componentes/home/home';
import { HomeService } from 'src/app/componentes/home/home.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { LoginService } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit,OnDestroy{

  usuario!:usuarioDatos
  materias:materias[]=[]
  suscripcionDatosUsuario?:Subscription
  suscripcionMaterias?:Subscription

  constructor(private datosUsuarioService:DatosUsuarioService,
    private loginService:LoginService,
    private homeService:HomeService,
    private router:Router){




  }
  ngOnInit(): void {
    this.suscripcionDatosUsuario = this.datosUsuarioService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if (usuario !== null) {
          this.usuario = usuario;
        }
      }
    })
    this.suscribirseMaterias()
  }

  ngOnDestroy(): void {
    this.suscripcionMaterias?.unsubscribe()
    this.suscripcionDatosUsuario?.unsubscribe()
  }

  cerrarSesion(){
    this.loginService.logout()
  }

  private suscribirseMaterias(){
   this.suscripcionMaterias = this.homeService.suscribirseMaterias().subscribe({
      next:(materias)=>{
        this.materias = materias
      }
    })
  }

  verMateria(materia:materias){
    this.router.navigate(['dashboard','materia',materia.id])
  }

  verUsuario(){
    this.router.navigate(['dashboard','usuario'])
  }

  nosotros(){
    this.router.navigate(['dashboard','nosotros'])
  }

  navegarLogin(ruta:string){
    this.router.navigate(['login',ruta])
  }

  tutoriales(){
    this.router.navigate(['dashboard','tutoriales'])
  }

}
