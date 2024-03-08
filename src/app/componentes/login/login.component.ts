import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { usuarioLogin } from 'src/app/modelos/usuarioLogin';
import { SpinnerService } from 'src/app/otros/spinner/spinner.service';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';

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
  private ngUnsubscribe = new Subject();


  constructor(private autentificacionService:AutentificacionService,
    private datosUsuarioService:DatosUsuarioService,
    private sipinnerService:SpinnerService)
  {

  }

  ngOnInit(): void {
    this.obtenerUsuario()
    this.seleccionoInstitucion()
    this.seleccionoRol()
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null)
    this.ngUnsubscribe.complete()
  }
  ngAfterViewInit(): void {
    this.sipinnerService.ocultarSpinner()
  }

  obtenerUsuario(){
    this.datosUsuarioService.obtenerDatos()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(usuario)=>{
        if (usuario !== null) {
          this.usuario = usuario;
        }
      }
    })
  }

  seleccionoInstitucion(){
    this.autentificacionService.seleccionoInstitucion()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(respuesta:boolean)=>{
        this.seleccionInstitucion = respuesta
      }
    })
  }

  seleccionoRol(){
    this.autentificacionService.seleccionoRol()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
        next:(respuesta:boolean)=>{
          this.seleccionRol = respuesta
        }
      })
  }

  login(usuario:HTMLInputElement,password:HTMLInputElement){
    let login = new usuarioLogin(usuario.value,password.value)
    this.autentificacionService.login(login)
  }

}
