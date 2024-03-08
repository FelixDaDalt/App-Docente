import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { rol, usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';

@Component({
  selector: 'app-rol-seleccion',
  templateUrl: './rol-seleccion.component.html',
  styleUrls: ['./rol-seleccion.component.css']
})
export class RolSeleccionComponent implements OnInit,OnDestroy{

  usuario!:usuarioDatos
  listaRoles:rol[]=[]
  rolSeleccionado!:rol
  private ngUnsubscribe=new Subject()


  constructor(private datosUsuarioService:DatosUsuarioService)
  {


  }
  ngOnInit(): void {
    this.obtenerDatosUsuario()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null)
    this.ngUnsubscribe.complete()
  }

  obtenerDatosUsuario(){
    this.datosUsuarioService.obtenerDatos()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next:(usuario)=>{
        if (usuario !== null && usuario.Institucion_selected) {
          this.usuario = usuario;
          this.listaRoles = this.usuario.Institucion_selected.roles
          if(!this.usuario.Rol_selected){
            this.rolSeleccionado = this.listaRoles[0]
          }else{
            let index = this.listaRoles.findIndex(x=>x.id_nivel == this.usuario.Rol_selected?.id_nivel)
            this.rolSeleccionado = this.listaRoles[index]
          }
        }
      }
    })
  }

  seleccionarRol(){
    this.usuario.Rol_selected = this.rolSeleccionado
    this.datosUsuarioService.establecerDatos(this.usuario)
  }
}
