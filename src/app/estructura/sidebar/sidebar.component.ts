import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { materias } from 'src/app/componentes/home/home';
import { HomeService } from 'src/app/componentes/home/home.service';
import { MateriasService } from 'src/app/componentes/materias/materias.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  usuario!:usuarioDatos
  materias:materias[]=[]

  constructor(datosUsuarioService:DatosUsuarioService,
    private autentificacionService:AutentificacionService,
    private homeService:HomeService,
    private materiaService:MateriasService,
    private router:Router){

      datosUsuarioService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if (usuario !== null) {
          this.usuario = usuario;
        }
      }
    })

    this.obtenerMaterias()
  }

  cerrarSesion(){
    this.autentificacionService.logout()
  }

  seleccionarInstitucion(){
    this.autentificacionService.establecerOpciones(true,false)
  }

  seleccionarRol(){
    this.autentificacionService.establecerOpciones(false,true)
  }

  private obtenerMaterias(){
    this.homeService.obtenerMateriasAsignadas().subscribe({
      next:(materias)=>{
        this.materias = materias
      }
    })
  }

  verMateria(materia:materias){
    this.materiaService.setMateria(materia)
    this.router.navigate(['materia'])
  }


}
