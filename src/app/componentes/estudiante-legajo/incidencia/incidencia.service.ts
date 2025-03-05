import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { IncidenciaForm } from './incidenciaForm';
import { environment } from 'src/enviroments/environment';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';


@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  private incidenciaFormSubject = new BehaviorSubject<IncidenciaForm[]>([]);
  incidenciaForm = this.incidenciaFormSubject.asObservable().pipe(shareReplay(1))
  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/legajo'
  private usuarioDatos!:usuarioDatos


  constructor(private http: HttpClient,
    usuarioDatosService:DatosUsuarioService) {
      usuarioDatosService.obtenerDatos().subscribe({
        next:(usuario)=>{
          if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
            this.usuarioDatos = usuario
          }
        }
      })
    }
  private getForm(idAlumno:number){
    return this.http.get<{ data: any }>(`${this.apiUrl}/lista_incidencias/${this.usuarioDatos.ID_Institucion}`,{params: { id_alumno: idAlumno, id_usuario:this.usuarioDatos.Institucion_selected.ID_Usuario_Interno}})
    .pipe(
      map(respuesta => respuesta.data)
    )
  }

  obtenerForm(idAlumno:number){
    this.getForm(idAlumno).pipe(take(1)).subscribe(incidenciaForm=>{
      this.incidenciaFormSubject.next(incidenciaForm)
    })
  }



  enviarInicidencia(form:any): Observable<any> {
    // Guardar temporalmente los adjuntos y eliminar del objeto para la primera solicitud
    let adjuntos = form.arr_adjuntos;
    form.arr_adjuntos = [];

    // Primera solicitud para crear la nueva difusión
    return this.http.post<{ data: any }>(`${this.apiUrl}/agregar_incidencia/${this.usuarioDatos.ID_Institucion}`, form).pipe(
      switchMap((respuesta) => {
        const idItem = Number(respuesta.data.split(' - ')[0]);

        // Si hay adjuntos, realizar la segunda solicitud para adjuntarlos
        if (adjuntos && adjuntos.length > 0) {
          let apiUrl = null
          if(form.tipo_incidencia == 1){
            apiUrl = this.usuarioDatos.Institucion_selected.ID_Institucion < 10
            ? 'https://pesge.com.ar/conexiones/adjuntar_certificados.php'
            : 'https://geoeducacion.com.ar/conexiones/adjuntar_certificados.php';
          } else if(form.tipo_incidencia == 2){
            apiUrl = this.usuarioDatos.Institucion_selected.ID_Institucion < 10
            ? 'https://pesge.com.ar/conexiones/adjuntar_documentacion.php'
            : 'https://geoeducacion.com.ar/conexiones/adjuntar_documentacion.php';
          }


          // Configurar el FormData con los adjuntos
          const formDataAdjuntos = new FormData();
          formDataAdjuntos.append('id_institucion', this.usuarioDatos.Institucion_selected.ID_Institucion.toString());
          formDataAdjuntos.append('id_item', idItem.toString());
          adjuntos.forEach((adjunto: any) => {
            formDataAdjuntos.append('adjunto[]', adjunto);
          });

          // Realizar la solicitud para adjuntar los documentos
          if(apiUrl)
            return this.adjuntarDocumentos(apiUrl, formDataAdjuntos);

          return of(null);
        } else {
          // Si no hay adjuntos, retornar un observable vacío
          return of(null);
        }
      }),

    );
  }

  private adjuntarDocumentos(apiUrl: string, formDataAdjuntos: FormData): Observable<any> {
    return this.http.post<{ data: any }>(apiUrl, formDataAdjuntos, {
      headers: {
        'charset': 'UTF-8' // Especificar UTF-8 en el encabezado
      }
    }).pipe(
      map((respuesta) => respuesta),  // Devolver directamente la respuesta
      shareReplay(1)  // Compartir la respuesta en caso de múltiples suscripciones
    );
  }
}
