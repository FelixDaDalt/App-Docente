import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { Aviso, falta, inasistencia, legajoAlumno } from './legajo';
import { BehaviorSubject, Subject, forkJoin, map } from 'rxjs';
import { resultadoBusqueda } from '../home/home';


@Injectable({
  providedIn: 'root'
})
export class EstudianteLegajoService {

  private urlInasistencia = 'https://apiteach.geoeducacion.com.ar/api/asistencias/inasistencias_alumno/';
  private urlRegistro = 'https://apiteach.geoeducacion.com.ar/api/legajo/legajo_alumno/';
  private urlCalificaciones = 'https://apiteach.geoeducacion.com.ar/api/calificacion/lista_calificaciones_alumno/';

  private usuarioDatos!:usuarioDatos
  private alumno!:resultadoBusqueda
  private legajo=new legajoAlumno()
  private legajo$ = new Subject<legajoAlumno>

  constructor(private http: HttpClient,
    private datosUsuarioService:DatosUsuarioService)
    {
      this.obtenerDatosUsuario()
    }



    private obtenerDatosUsuario(){
      this.datosUsuarioService.obtenerDatos().subscribe({
        next:(usuario)=>{
          if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
            this.usuarioDatos = usuario
          }
        }
      })
    }

    private getInasistencias() {
      return this.http.get<{ data: any }>(`${this.urlInasistencia}${this.usuarioDatos.ID_Institucion}`, {params: { id_alumno: this.alumno.id, tipo_parte: "Z" }})
        .pipe(
          map(respuesta => {
            this.legajo.inasistencia = respuesta.data;
            this.legajo.inasistencia!.todas_juntas = this.unirInasistencias(this.legajo.inasistencia!);
            return this.legajo;
          })
        );
    }

    private getRegistros() {
      return this.http.get<{ data: any }>(`${this.urlRegistro}${this.usuarioDatos.ID_Institucion}`, {params: { id_alumno: this.alumno.id, id_usuario: this.usuarioDatos.ID_Usuario_Interno}})
        .pipe(
          map(respuesta => {
            this.legajo.legajo = respuesta.data.categorias;
            return this.legajo;
          })
        );
    }

    private getCalificaciones(){
      return this.http.get<{ data: any }>(`${this.urlCalificaciones}${this.usuarioDatos.ID_Institucion}`, {params: { id_alumno: this.alumno.id}})
        .pipe(
          map(respuesta => {
            this.legajo.academico = respuesta.data
            return this.legajo;
          })
        );
    }

    private getDatos(): void {
      forkJoin({
        inasistencias: this.getInasistencias(),
        registros: this.getRegistros(),
        academico: this.getCalificaciones()
      }).subscribe({
        next: (result) => {
          this.legajo$.next(this.legajo);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    }

    private unirInasistencias(inasistencia:inasistencia): falta[] {
      let todasJuntas: falta[] = [];

      // Concatenamos todas las faltas en una sola lista
      todasJuntas = todasJuntas.concat(
        inasistencia.tarde,
        inasistencia.ausente,
        inasistencia.ausente_justificado,
        inasistencia.ausente_RI
      );

      todasJuntas.sort((a, b) => {
        // Convertimos las fechas a objetos Date para compararlas
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);

        // Comparamos las fechas y devolvemos el resultado
        return fechaB.getTime() - fechaA.getTime();
      });
      return todasJuntas;
    }

    setIdEstudiante(alumno:resultadoBusqueda){
      this.alumno = alumno
      this.legajo.alumno = this.alumno
      this.getDatos()
    }

    suscripcionLegajo(){
      return this.legajo$.asObservable()
    }

}
