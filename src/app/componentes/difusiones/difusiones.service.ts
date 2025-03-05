import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, finalize, map, Observable, of, pipe, shareReplay, Subscription, switchMap, take, tap } from 'rxjs';
import { difusion, difusion_detalle } from './difusion';
import { comunicado_destinatario } from 'src/app/componentes/comunicados/comunicado';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';


@Injectable({
  providedIn: 'root'
})
export class DifusionService {


  private difusionesSubject = new BehaviorSubject<difusion[]>([]);
  difusiones$: Observable<difusion[]> = this.difusionesSubject.asObservable().pipe(shareReplay(1));

  private difusionSubject = new BehaviorSubject<difusion_detalle|null>(null);
  difusion$: Observable<difusion_detalle | null> = this.difusionSubject.asObservable().pipe(shareReplay(1));

  private difusionEditarSubject = new BehaviorSubject<difusion_detalle|null>(null);
  difusionEditar$: Observable<difusion_detalle | null> = this.difusionEditarSubject.asObservable().pipe(shareReplay(1));

  private destinatariosSubject = new BehaviorSubject<comunicado_destinatario[]>([]);
  destinatarios$: Observable<comunicado_destinatario[]> = this.destinatariosSubject.asObservable().pipe(shareReplay(1));

  private usuarioDatos!:usuarioDatos
  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/difusion_actividades';

  constructor(private http:HttpClient,usuarioDatosService:DatosUsuarioService) {
    usuarioDatosService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
          this.usuarioDatos = usuario
        }
      }
    })

    this.obtenerTodos()
  }

  private getDifusiones(): Observable<difusion[]> {
    return  this.http.get<any>(`${this.apiUrl}/show_publicaciones/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno}})
    .pipe(
      map(respuesta => respuesta.data),
      map(data => {
        // Ordenar por fecha y hora de más reciente a más viejo
        return data.sort((a: any, b: any) => {
          const fechaA = new Date(`${a.fecha}`);
          const fechaB = new Date(`${b.fecha}`);
          return fechaB.getTime() - fechaA.getTime();
        });
      })
    );
  }

  private obtenerTodos(){
    this.getDifusiones().pipe(

      take(1),
    ).subscribe(comunicados => this.difusionesSubject.next(comunicados));
  }

  actualizar(){
    this.obtenerTodos()
  }

  // filtrar(desde: number, hasta: number): void {
  //   this.getComunicados().pipe(
  //     map(comunicados => comunicados.filter(comunicado => comunicado.porcentaje_lectura >= desde && comunicado.porcentaje_lectura <= hasta)),
  //     take(1),
  //   ).subscribe(comunicados => this.comunicadosSubject.next(comunicados));
  // }

  private obtenerDifusionDetalle(difusion:difusion) {
    return this.http.get<any>(`${this.apiUrl}/show_publicacion_id/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno,id_publicacion:difusion.id.toString()}})
      .pipe(
        map(respuesta => respuesta.data[0]),
        map(respuesta => {
          return { ...respuesta, id: difusion.id, id_curso:difusion.id_curso }; // Asigna el id de idDifusion
        })
      );
  }

  leerDifusion(difusion: difusion): void {
    this.obtenerDifusionDetalle(difusion).pipe(take(1)).subscribe(
      difusionDetalle => this.difusionSubject.next(difusionDetalle)
    )
  }

  obtenerDestinatarios(){
    const params = {
      id_usuario: this.usuarioDatos.ID_Usuario_Interno || 0,
      id_curso:0,
      id_materia:0
    };
    this.http.get<{ data: any }>(`https://apiteach.geoeducacion.com.ar/api/detalle_comunicados/lista_destinatarios/${this.usuarioDatos.ID_Institucion}`, { params })
      .pipe(
        map(respuesta => respuesta.data),
        take(1)
      ).subscribe(destinatarios => this.destinatariosSubject.next(destinatarios));
  }

  enviarDifusion(nuevaDifusion: any): Observable<any> {

    const params = new HttpParams()
      .set('id_usuario', this.usuarioDatos.ID_Usuario_Interno)
      .set('rol', this.usuarioDatos.Rol_selected?.rol.toString()||'')
      .set('id_nivel',this.usuarioDatos.Rol_selected?.id_nivel.toString() || '')

    let adjuntos = nuevaDifusion.arr_adjuntos;
    nuevaDifusion.arr_adjuntos = [];

    return this.http.post<{ data: any }>(`${this.apiUrl}/nueva_publicacion/${this.usuarioDatos.ID_Institucion}`, nuevaDifusion,{params}).pipe(
      switchMap((respuesta) => {
        const idComunicado = Number(respuesta.data.split(' - ')[0]);
        if (adjuntos && adjuntos.length > 0) {
          const apiUrl = this.usuarioDatos.Institucion_selected.ID_Institucion < 10 ? 'https://pesge.com.ar/conexiones/adjuntar_multimedia.php' : 'https://geoeducacion.com.ar/conexiones/adjuntar_multimedia.php';
          const formDataAdjuntos = new FormData();
          formDataAdjuntos.append('id_institucion', this.usuarioDatos.Institucion_selected.ID_Institucion.toString());
          formDataAdjuntos.append('id_difusion', idComunicado.toString());
          adjuntos.forEach((adjunto: any) => {
            formDataAdjuntos.append('adjunto[]', adjunto);
          });

          return this.adjuntarDocumentos(apiUrl, formDataAdjuntos);
        } else {
          return of(null); // Si no hay adjuntos, retornar un observable vacío
        }
      }),
      tap(() => this.obtenerTodos())
    );
  }

  editarDifusion(nuevaDifusion: any): Observable<any> {
    const params = new HttpParams()
      .set('id_usuario', this.usuarioDatos.ID_Usuario_Interno)
      .set('rol', this.usuarioDatos.Rol_selected?.rol.toString()||'')
      .set('id_nivel',this.usuarioDatos.Rol_selected?.id_nivel.toString() || '')

    let adjuntos = nuevaDifusion.arr_adjuntos;
    nuevaDifusion.arr_adjuntos = [];
    return this.http.patch<{ data: any }>(`${this.apiUrl}/editar_publicacion/${this.usuarioDatos.ID_Institucion}`, nuevaDifusion,{params}).pipe(
      switchMap((respuesta) => {
        const idComunicado = nuevaDifusion.id_publicacion
        if (adjuntos && adjuntos.length > 0) {
          const apiUrl = this.usuarioDatos.Institucion_selected.ID_Institucion < 10 ? 'https://pesge.com.ar/conexiones/adjuntar_multimedia.php' : 'https://geoeducacion.com.ar/conexiones/adjuntar_multimedia.php';
          const formDataAdjuntos = new FormData();
          formDataAdjuntos.append('id_institucion', this.usuarioDatos.Institucion_selected.ID_Institucion.toString());
          formDataAdjuntos.append('id_difusion', idComunicado.toString());
          adjuntos.forEach((adjunto: any) => {
            formDataAdjuntos.append('adjunto[]', adjunto);
          });

          return this.adjuntarDocumentos(apiUrl, formDataAdjuntos);
        } else {
          return of(null); // Si no hay adjuntos, retornar un observable vacío
        }
      }),
      tap(() => this.obtenerTodos())
    );
  }

  private adjuntarDocumentos(apiUrl: string, adjuntos: any): Observable<any> {
    return this.http.post<{ data: any }>(apiUrl, adjuntos).pipe(
      map((respuesta) => {
        return respuesta;
      }),
      shareReplay(1)  // Asegura que la respuesta se comparta y no se realicen múltiples solicitudes
    );
  }

  borrarDifusion(idDifusion: number): Observable<any> {

    const params = new HttpParams()
    .set('id_publicacion', idDifusion.toString())
    .set('id_usuario', this.usuarioDatos.ID_Usuario_Interno)
    .set('rol', this.usuarioDatos.Rol_selected?.rol.toString()||'')
    .set('id_nivel',this.usuarioDatos.Rol_selected?.id_nivel.toString() || '')

    return this.http.put<{ data: any }>(`${this.apiUrl}/eliminar_publicacion/${this.usuarioDatos.ID_Institucion}`,null, { params }).pipe(
      tap(() => this.obtenerTodos()),
      shareReplay(1),
      take(1)
    );
  }

  eliminarAchivo(idArchivo: number): Observable<any> {
    const params = new HttpParams()
    .set('id_imagen', idArchivo.toString())
    .set('id_usuario', this.usuarioDatos.ID_Usuario_Interno)
    .set('rol', this.usuarioDatos.Rol_selected?.rol.toString()||'')
    .set('id_nivel',this.usuarioDatos.Rol_selected?.id_nivel.toString() || '')

    return this.http.put<{ data: any }>(`${this.apiUrl}/borrar_imagen/${this.usuarioDatos.ID_Institucion}`, null, { params }).pipe(
      map(response => {
        this.difusion$ = this.difusion$.pipe(
          take(1),
          map((difusionDetalle) => {
            if (difusionDetalle && difusionDetalle.imagenes) {
              const nuevasImagenes = difusionDetalle.imagenes.filter(
                (img:any) => img.id_imagen !== idArchivo
              );
              return {
                ...difusionDetalle,
                imagenes: nuevasImagenes
              };
            }
            return difusionDetalle;
          }),
          tap(difusion => this.difusionSubject.next(difusion))
        );
        return response.data;
      })
    );
  }

  editar(difusion:difusion){
    this.obtenerDifusionDetalle(difusion).pipe(take(1)).subscribe(
      difusion => this.difusionEditarSubject.next(difusion)
    )
  }

  emitirDifusionDetalle(difusionDetalle:difusion_detalle){
    this.difusionEditarSubject.next(difusionDetalle)
  }

}
