import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { calificacion_instrumento } from '../../calificacion/calificacion-instrumentos/calificacion-instrumento';
import { materias } from '../../home/home';
import { CalificacionService } from '../../calificacion/calificacion.service';
import { MateriasService } from '../materias.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materias-calificaciones',
  templateUrl: './materias-calificaciones.component.html',
  styleUrls: ['./materias-calificaciones.component.css']
})
export class MateriasCalificacionesComponent implements OnInit,OnDestroy{
  private suscriberInstrumentos?:Subscription
  private suscriberMateria?:Subscription

  instrumentos:calificacion_instrumento[]=[]
  private materia?:materias | null
  suscripcionesActivas=0

  constructor(private calificacionService:CalificacionService,
    private materiasService:MateriasService,
    private router:Router){

  }

  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe()
    this.suscripcionesActivas--
    this.suscriberInstrumentos?.unsubscribe()
    this.suscripcionesActivas--

  }

  ngOnInit(): void {
    this.suscripcionMateria()
      this.suscripcionInstrumentos()


  }

  private suscripcionMateria(){
    if (this.suscriberMateria) {
      this.suscriberMateria.unsubscribe();
      this.suscripcionesActivas--
    }

    this.suscripcionesActivas++
    this.suscriberMateria = this.materiasService.suscripcionMateria().subscribe({
      next:(materia)=>{
        this.materia = materia
        this.obtenerInstrumentos()
      }
    })
  }

  private suscripcionInstrumentos(){
    if (this.suscriberInstrumentos) {
      this.suscriberInstrumentos.unsubscribe();
      this.suscripcionesActivas--
    }

      this.suscripcionesActivas++
      this.suscriberInstrumentos = this.calificacionService.suscripcionInstrumentos().subscribe({
        next:(calificacion_instrumentos)=>{
          this.instrumentos = calificacion_instrumentos
        }
      })


  }

  private obtenerInstrumentos(){
    if(this.materia && this.materia?.tipo_materia!='Z')
    {
      this.calificacionService.obtenerInstrumentos(this.materia.id, this.materia.tipo_materia)
    }
  }

  continuarCalificacion(id_operacion:number){
    this.calificacionService.continuarCalificacion(id_operacion,this.materia?.id!,this.materia?.tipo_materia!)
    this.router.navigate(['calificacion','calificacion-notas'])
  }
}
