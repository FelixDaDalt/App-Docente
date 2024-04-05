import { DatosUsuarioService } from './../../../servicios/datos-usuario.service';
import { usuarioDatos } from './../../../modelos/usuarioDatos';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { LoginService } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {

  usuarioDatos?:Observable<usuarioDatos|null>
  darsebaja=false
  confirmarbaja=false
  motivos?:string

  constructor(private DatosUsuarioService:DatosUsuarioService,
    private homeService:HomeService,
    private loginService:LoginService){
    this.obtenerDatos()
  }

  obtenerDatos(){
    this.usuarioDatos = this.DatosUsuarioService.obtenerDatos()
  }

  darseBaja(){
    this.darsebaja = true
  }

  confirmarBaja(){
    this.confirmarbaja = true
  }

  aceptarBaja(){
    this.homeService.draseBaja(this.motivos).subscribe({
      next:()=>{
        this.loginService.logout()
      }
    })
  }
}
