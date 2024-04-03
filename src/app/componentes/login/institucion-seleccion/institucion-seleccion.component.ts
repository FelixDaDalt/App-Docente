import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Institucion, usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';

@Component({
  selector: 'app-institucion-seleccion',
  templateUrl: './institucion-seleccion.component.html',
  styleUrls: ['./institucion-seleccion.component.css']
})
export class LoginSeleccionComponent implements OnInit,OnDestroy{

  usuario!:usuarioDatos
  listaInstitucion:Institucion[]=[]
  institucionSeleccionada!:Institucion

  private obtenerDatosUsuarios?:Subscription


  constructor(private datosUsuarioService:DatosUsuarioService,
    private router:Router)
  {

  }
  ngOnInit(): void {
    this.obtenerDatosUsuario()
  }
  ngOnDestroy(): void {
    this.obtenerDatosUsuarios?.unsubscribe()
  }

  private obtenerDatosUsuario(){
   this.obtenerDatosUsuarios = this.datosUsuarioService.obtenerDatos()
    .subscribe({
      next:(usuario)=>{
        if (usuario !== null) {
          this.usuario = usuario;
          this.listaInstitucion = this.usuario.Instituciones
        }
      }
    })
  }

  seleccionarInstitucion(){
    this.usuario.ID_Institucion = this.institucionSeleccionada.ID_Institucion
    this.usuario.ID_Usuario_Interno = this.institucionSeleccionada.ID_Usuario_Interno
    this.usuario.Institucion_selected = this.institucionSeleccionada
    this.usuario.Institucion = this.institucionSeleccionada.Institucion
    this.usuario.Rol_selected = undefined
    this.datosUsuarioService.establecerDatos(this.usuario)
    this.router.navigate(['login','seleccion-rol'])
  }
}
