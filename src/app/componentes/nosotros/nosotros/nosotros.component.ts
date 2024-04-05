import { Component } from '@angular/core';
import { environment } from 'src/enviroments/environment';
import { HomeService } from '../../home/home.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { Observable } from 'rxjs';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { LoginService } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent {

  version:string
  copyrigth:string
  usuarioDatos?:Observable<usuarioDatos|null>
  darsebaja=false
  confirmarbaja=false
  motivos?:string

  constructor(private DatosUsuarioService:DatosUsuarioService,
    private homeService:HomeService,
    private loginService:LoginService){
    this.obtenerDatos()
    this.version = environment.version
    this.copyrigth = environment.copyrigth
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
