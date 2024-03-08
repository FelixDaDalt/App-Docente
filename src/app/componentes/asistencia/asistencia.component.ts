import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsistenciaService } from './asistencia.service';
import { Asistencia, Parte_Alumno, Parte_Asistencia} from './asistencia';
import { formatDate } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit,OnDestroy{


  private suscripcionAsistencia?:Subscription | null

  asistencias:Asistencia[]=[]
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
    this.suscribirseAsistencia();
    this.inicializarFechas();
    this.obtenerAsistencias();
    this.inicializarComerdor();
  }

  ngOnDestroy(): void {
    if (this.suscripcionAsistencia) {
      this.suscripcionAsistencia.unsubscribe();
    }
  }



  private inicializarFechas() {
    if(!this.fecha){
      this.fecha = this.formatoFecha(new Date());
      this.fechaMax = this.fecha
    }else{
      let fecha = this.formatoFecha(new Date());
      this.fechaMax = fecha
    }

  }

  private formatoFecha(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  private suscribirseAsistencia(){
    if (this.suscripcionAsistencia) {
      this.suscripcionAsistencia.unsubscribe();
    }

      this.suscripcionAsistencia = this.asistenciaService.suscribirseAsistencia().subscribe({
        next:(asistencias)=>{
          this.asistencias = asistencias
          this.seleccionarAsistencia();
          this.comprobarEdicion()
          this.inicializarEstados()
        }
      })


  }


  private seleccionarAsistencia() {
    if(this.id && this.id != -1){
      let index = this.asistencias?.findIndex(x => x.id_parte == this.id)
      if(index!== -1){
        this.asistenciaSeleccionada = this.asistencias[index]
        this.id = -1
      }
    }else{
      if (this.asistenciaSeleccionada) {
        this.asistenciaSeleccionada = this.asistencias?.find(x => x.id === this.asistenciaSeleccionada.id) || this.asistencias?.[0];
      } else {
        this.asistenciaSeleccionada = this.asistencias?.[0];
      }
    }
  }

  private inicializarEstados() {
    if (this.asistencias) {
      this.asistencias.forEach(asistencia=>{
        asistencia.alumnos.forEach(alumno => {
          if(alumno.estado_asistencia == ''){
            if(alumno.justificacion==1)
            {
              alumno.estado = 'A';
            }else{
              alumno.estado = 'P';
            }
          }else{
            alumno.estado = alumno.estado_asistencia
          }

          if(alumno.justificacion==1){
            alumno.observacion = alumno.detalle_justificacion
          }
      });
    });
    }
  }

  private inicializarComerdor(){
    if (this.asistencias) {
      this.asistencias.forEach(asistencia=>{
        asistencia.alumnos.forEach(alumno => {
          alumno.estado_comedor = alumno.comedor
        })
      })
    }
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
    this.asistenciaService.postAsistencias(parteAsistencia)

  }

  editar(){
    this.checkDeshabilitados=false
  }

  comprobarEdicion(){
    if(this.asistenciaSeleccionada.editable==0 || this.asistenciaSeleccionada.id_parte!=0){
      this.checkDeshabilitados = true
    }else{
      this.checkDeshabilitados=false
    }
  }

  obtenerAsistencias(){
    this.asistenciaService.obtenerAsistencias(this.fecha)
  }


}
