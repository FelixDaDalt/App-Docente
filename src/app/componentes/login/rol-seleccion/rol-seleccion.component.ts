import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { rol, usuarioDatos } from 'src/app/modelos/usuarioDatos';
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

  obtenerDatosUsuario(){
    this.obtenerDatosUsuarios = this.datosUsuarioService.obtenerDatos()
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
    this.router.navigate(['dashboard'])
  }
}
