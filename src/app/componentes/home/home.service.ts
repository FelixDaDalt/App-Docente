import { AutentificacionService } from './../../servicios/autentificacion.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, forkJoin, interval, map, of } from 'rxjs';
import { alumno, home, materias, notificacionHome, resultadoBusqueda } from './home';
import { HttpClient } from '@angular/common/http';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { NotificacionService } from '../../otros/notificacion-popup/notificacionpopup.service';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private usuarioDatos!:usuarioDatos
  private apiUrl = 'https://apiteach.geoeducacion.com.ar/api/home';
  private alumnoUrl = 'https://apiteach.geoeducacion.com.ar/api/cursos'
  private homeSubject = new BehaviorSubject<home | null>(null);
  private notificacionHomeSubject = new BehaviorSubject<notificacionHome | null>(null);
  private homeDatos:home
  private searchAlumno$ = new Subject<resultadoBusqueda[]>()
  private resultadoBusqueda:resultadoBusqueda[]=[]
  private Alumnos$ = new Subject<alumno[]>()
  private Alumnos:alumno[]=[]
  private materias$ = new BehaviorSubject<materias[] | []>([]);

  constructor(private http: HttpClient,
    private datosUsuarioService:DatosUsuarioService,
    private notificacionService:NotificacionService,
    private autentificacionService:AutentificacionService)
    {
      this.homeDatos = new home()
      this.obtenerDatosUsuario()
    }

  private obtenerDatosUsuario(){
    this.datosUsuarioService.obtenerDatos().subscribe({
      next:(usuario)=>{
        if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
          this.usuarioDatos = usuario
          this.getHomeData()
          this.getMaterias()
        }
      }
    })
  }

  private getHomeData() {
    const intervalo$ = interval(10000);

    intervalo$.subscribe(() => {

      const novedadesRequest = this.http.get<{ data: any }>(`${this.apiUrl}/novedades/${this.usuarioDatos.ID_Institucion}`, {params: { id_nivel: this.usuarioDatos.Rol_selected?.id_nivel||'' }}).pipe(
        catchError(error => {
          this.notificacionService.establecerNotificacion('error','Error en la solicitud de Novedades')
          return of({ data: [] }); // Tratar el error según tus necesidades
        })
      );

      const notificacionesRequest = this.http.get<{ data: any }>(`${this.apiUrl}/notificaciones/${this.usuarioDatos.ID_Institucion}`, {params: { id_nivel: this.usuarioDatos.Rol_selected?.id_nivel||'', id_usuario: this.usuarioDatos.ID_Usuario_Interno }}).pipe(
        catchError(error => {
          this.notificacionService.establecerNotificacion('error','Error en la solicitud de Notificaciones')
          return of({ data: {} }); // Tratar el error según tus necesidades
        })
      );
      forkJoin([novedadesRequest, notificacionesRequest])
      .subscribe(([novedadesResponse, notificacionesResponse]) => {
        this.homeDatos.novedades = novedadesResponse.data;
        this.homeDatos.notificaciones = notificacionesResponse.data[0];
        this.emitirHomeDatos();
      },
      error => {
        this.notificacionService.establecerNotificacion('error','Error en las solicitudes')
        console.log(error)
      },
      () => {


      });
    })

  }

  private getMaterias(){
    this.http.get<{ data: any }>(`${this.apiUrl}/materias_asignadas/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno, id_nivel:this.usuarioDatos.Rol_selected!.id_nivel, rol:this.usuarioDatos.Rol_selected!.rol }})
    .subscribe({
      next:(respuesta)=>{
        this.materias$.next(respuesta.data)
      }
    })
  }

  suscribirseMaterias(){
    return this.materias$.asObservable()
  }



  private emitirHomeDatos() {
    this.homeSubject.next(this.homeDatos);
    this.notificacionHomeSubject.next(this.homeDatos.notificaciones)
  }

  getHomeDatosObservable(): Observable<home | null> {
    return this.homeSubject.asObservable();
  }

  getHomeDatosNotificacionesObservable(): Observable<notificacionHome | null> {
    return this.notificacionHomeSubject.asObservable();
  }

  actualizarNotificaciones() {
    const notificacionesRequest = this.http.get<{ data: any }>(`${this.apiUrl}/notificaciones/${this.usuarioDatos.ID_Institucion}`, {
      params: {
        id_nivel: this.usuarioDatos.Rol_selected?.id_nivel || '',
        id_usuario: this.usuarioDatos.ID_Usuario_Interno
      }
    }).pipe(
      catchError(error => {
        this.notificacionService.establecerNotificacion('error', 'Error en la solicitud de Notificaciones');
        return of({ data: {} }); // Tratar el error según tus necesidades
      })
    );

    notificacionesRequest.subscribe(
      (notificacionesResponse) => {
        this.homeDatos.notificaciones = notificacionesResponse.data[0];
        this.emitirHomeDatos();
        this.notificacionService.establecerNotificacion('success', 'Notificaciones actualizadas correctamente');
      },
      (error) => {
        this.notificacionService.establecerNotificacion('error', 'Error al actualizar notificaciones');
        console.log(error);
      }
    );
  }



  private searchAlumno(termino:string){
    this.http.get<{ data: any }>(`${this.apiUrl}/search_alumno/${this.usuarioDatos.ID_Institucion}`, {params: { id_usuario: this.usuarioDatos.ID_Usuario_Interno, busqueda:termino }}).subscribe({
      next:(respuesta)=>{
        this.resultadoBusqueda = respuesta.data
        this.emitirResultado(this.resultadoBusqueda)
      }
    })
  }

  private emitirResultado(resultado:resultadoBusqueda[]) {
    this.searchAlumno$.next(resultado)
  }

  suscripcionBusqueda(){
    return this.searchAlumno$.asObservable()
  }

  buscarAlumno(termino:string){
    this.searchAlumno(termino)
  }

  obtenerBusqueda(){
    this.emitirResultado(this.resultadoBusqueda)
  }

  private getAlumnos(idMateria:number, tipo_materia:string){
    this.http.get<{ data: any }>(`${this.alumnoUrl}/lista_alumnos/${this.usuarioDatos.ID_Institucion}`, {params: { id_materia: idMateria, tipo_materia:tipo_materia, id_nivel:this.usuarioDatos.Rol_selected!.id_nivel, rol:this.usuarioDatos.Rol_selected!.rol, id_usuario:this.usuarioDatos.ID_Usuario_Interno }}).subscribe({
      next:(respuesta)=>{
        this.Alumnos = respuesta.data
        this.emitirAlumnos(respuesta.data)
      }
    })
  }

  private emitirAlumnos(alumnos:alumno[]){
    this.Alumnos$.next(alumnos)
  }

  suscripcionAlumnos(){
    return this.Alumnos$.asObservable()
  }

  obtenerAlumnos(idMateria:number, tipo_materia:string){
    this.getAlumnos(idMateria, tipo_materia)
  }

  draseBaja(motivos?:string){
     this.http.post<{ data: any }>(`${this.apiUrl}/baja_usuario/${this.usuarioDatos.ID_Usuario_Interno}`, {motivos:motivos}).subscribe({
      next:(respuesta)=>{
        this.autentificacionService.logout()
      }
    })
  }

}
