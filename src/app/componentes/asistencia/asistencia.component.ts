import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsistenciaService } from './asistencia.service';
import { Asistencia, Parte_Alumno, Parte_Asistencia} from './asistencia';
import { formatDate } from '@angular/common';
import { Observable, Subscription, map, observable, of, shareReplay, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit,OnDestroy{


  private suscripcionAsistencia?:Subscription
  private suscripcionSeleccionAsistencia?:Subscription

  asistencia$:Observable<Asistencia[]> = of([])


  asistenciaSeleccionada!:Asistencia
  fecha!:string
  fechaMax!:string
  checkDeshabilitados=false
  id?:number
  usuario?:usuarioDatos | null

  constructor(private asistenciaService:AsistenciaService,
    private route: ActivatedRoute,
    private usuarioService:DatosUsuarioService)
  {
   this.usuarioService.obtenerDatos().subscribe({
    next:(usuario)=>{
      this.usuario = usuario

    }
   })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      let fecha = params['fecha'];
      if(fecha && id){
        this.fecha = fecha
        this.id = id
      }
    });
    this.inicializarFechas();
    this.suscripcionAsistencia = this.obtenerAsistencias().subscribe()
  }

  ngOnDestroy(): void {
      this.suscripcionAsistencia?.unsubscribe();
      this.suscripcionSeleccionAsistencia?.unsubscribe()
  }

  //ok
  private obtenerAsistencias(): Observable<Asistencia[]> {
    return this.asistenciaService.obtenerAsistencias(this.fecha).pipe(
      map(respuesta => this.inicializarEstados(respuesta)),
      map(asistenciasEstado => this.inicializarComedor(asistenciasEstado)),
      tap(asistencias => {
        this.asistencia$ = of(asistencias)
        this.seleccionarAsistencia();
      })
    );
  }

  //ok
  actualizarAsistencia(){
    this.suscripcionAsistencia = this.obtenerAsistencias().subscribe()
  }

  //ok
  private inicializarFechas() {
    if(!this.fecha){
      this.fecha = this.formatoFecha(new Date());
      this.fechaMax = this.fecha
    }else{
      let fecha = this.formatoFecha(new Date());
      this.fechaMax = fecha
    }
  }

  //ok
  private formatoFecha(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }


  //ok
  private seleccionarAsistencia() {
    this.suscripcionSeleccionAsistencia = this.asistencia$.subscribe(asistencias => {
      if (this.id && this.id !== -1) {
        let index = asistencias.findIndex(x => x.id_parte == this.id);
        if (index !== -1) {
          this.asistenciaSeleccionada = asistencias[index];
          this.id = -1;
          this.comprobarEdicion(this.asistenciaSeleccionada)
        }
      } else {
        if (this.asistenciaSeleccionada) {
          this.asistenciaSeleccionada = asistencias.find(x => x.id === this.asistenciaSeleccionada.id) || asistencias[0];
          this.comprobarEdicion(this.asistenciaSeleccionada)
        } else {
          this.asistenciaSeleccionada = asistencias[0];
        }
      }
    })
  }


  //ok
  private inicializarEstados(asistencias: Asistencia[]): Asistencia[] {
  if (!asistencias) return [];

  return asistencias.map(asistencia => ({
    ...asistencia,
    alumnos: asistencia.alumnos.map(alumno => ({
      ...alumno,
      estado: alumno.estado_asistencia === '' ? (alumno.justificacion === 1 ? 'A' : 'P') : alumno.estado_asistencia,
      observacion: alumno.justificacion === 1 ? alumno.detalle_justificacion : alumno.observacion
    }))
  }));
}

//Ok
private inicializarComedor(asistencias: Asistencia[]): Asistencia[] {
  if (!asistencias) return [];

  return asistencias.map(asistencia => ({
    ...asistencia,
    alumnos: asistencia.alumnos.map(alumno => ({
      ...alumno,
      estado_comedor: alumno.comedor
    }))
  }));
}

  aceptar(){
    let parteAsistencia = new Parte_Asistencia(this.asistenciaSeleccionada?.id,this.asistenciaSeleccionada?.tipo,this.fecha,this.asistenciaSeleccionada.id_parte)
    this.asistenciaSeleccionada?.alumnos.map(alumno=>{
      if(alumno.estado=='P'){
        alumno.observacion=''
      }
      let parteAlumno = new Parte_Alumno(alumno.id,alumno.estado,alumno.observacion,alumno.estado_comedor)
      parteAsistencia.arr_alumnos.push(parteAlumno)
    })
   const suscripcionEnvio = this.asistenciaService.agregarAsistencias(parteAsistencia).subscribe({
      next:()=>{
        this.actualizarAsistencia()
      },
      complete:()=>{
        suscripcionEnvio.unsubscribe()
      }
    })
  }

  editar(){
    this.checkDeshabilitados=false
  }

  private comprobarEdicion(asistencias:Asistencia){
    if(asistencias.editable==0 || asistencias.id_parte!=0){
      this.checkDeshabilitados = true
    }else{
      this.checkDeshabilitados=false
    }
  }
}
