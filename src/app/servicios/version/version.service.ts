import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DatosUsuarioService } from '../datos-usuario.service';
import { usuarioDatos } from '../../modelos/usuarioDatos';
import { environment } from 'src/enviroments/environment';
import { AutentificacionService } from '../autentificacion.service';
import { VersionModalComponent } from './version-modal/version-modal.component';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  version$?:Observable<string>
  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/home';
  private usuarioDatos!:usuarioDatos

  constructor(private http:HttpClient,
              private datosUsuarioService:DatosUsuarioService,
              private autentificacionService:AutentificacionService,
              private modalService:NgbModal) {
                this.obtenerDatosUsuario()
   }

   private obtenerDatosUsuario(){
    this.datosUsuarioService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
          this.usuarioDatos = usuario
          this.versionAPP()
        }
      }
    })
  }

  private versionAPP() {
    this.version$ = this.http.get<{ data: string }>(`${this.apiUrl}/version_app/${this.usuarioDatos.ID_Institucion}`).pipe(
      map(response => response.data)
    );
  }

  comprobarVersion() {
    this.version$?.subscribe({
      next: (version) => {
        if (version !== environment.version){
          const modalRef = this.modalService.open(VersionModalComponent,{
            size: 'lg'
          });
          modalRef.componentInstance.versionActual = version
          this.autentificacionService.logout()
        } else {
          console.log('Versión Correcta');
        }
      },
      error: (error) => {
        console.error('Error al obtener la versión:', error);
      }
    });
  }
}
