import { NotificacionService } from './../../../otros/notificacion-popup/notificacionpopup.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { usuarioLogin } from 'src/app/modelos/usuarioLogin';
import { SpinnerService } from 'src/app/otros/spinner/spinner.service';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { LoginService } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnInit,OnDestroy{

  usuario:usuarioDatos | undefined
  seleccionInstitucion = false
  seleccionRol = false
  loading: boolean = false;
  error:string|null = null

  suscripcionDatosUsuarios?:Subscription


  constructor(
    private datosUsuarioService:DatosUsuarioService,
    private sipinnerService:SpinnerService,
    private loginService:LoginService,
    private router:Router)
  {

  }

  ngOnInit(): void {
    this.obtenerUsuario()
  }

  ngOnDestroy(): void {
    this.suscripcionDatosUsuarios?.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.sipinnerService.ocultarSpinner()
  }

  obtenerUsuario(){
    this.suscripcionDatosUsuarios = this.datosUsuarioService.obtenerDatos()
    .subscribe({
      next:(usuario)=>{
        if (usuario !== null) {
          this.usuario = usuario;
        }
      }
    })
  }


  login(usuario:HTMLInputElement,password:HTMLInputElement){
    let login = new usuarioLogin(usuario.value,password.value)
    this.loginService.login(login).subscribe({
      next:(respuesta)=>{
        if(respuesta){
          this.router.navigate(['login','seleccion-institucion'])
        }else{
          this.error = "Error en la autetificacion"
        }
      },
      error:(e)=>{
        this.error = "Error en la autetificacion"
      }
    })
  }

}
