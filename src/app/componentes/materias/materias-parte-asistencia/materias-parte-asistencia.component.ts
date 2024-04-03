import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsistenciaService } from '../../asistencia/asistencia.service';
import { parte } from '../../asistencia/asistencia';
import { MateriasService } from '../materias.service';
import { Subscription } from 'rxjs';
import { materias } from '../../home/home';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materias-parte-asistencia',
  templateUrl: './materias-parte-asistencia.component.html',
  styleUrls: ['./materias-parte-asistencia.component.css']
})
export class MateriasParteAsistenciaComponent implements OnInit, OnDestroy{

  private suscriberParte?:Subscription
  private suscriberMateria?:Subscription
  private materia?:materias | null
  partes:parte[]=[]
  suscripcionesActivas=0

  constructor(private asistenciaService:AsistenciaService,
    private materiasService:MateriasService,
    private router:Router){

  }

  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe()
    this.suscriberParte?.unsubscribe()
  }

  ngOnInit(): void {
    this.suscribirsePartes()
    this.suscripcionMateria()
  }

  private suscribirsePartes(){
    if (this.suscriberParte) {
      this.suscriberParte.unsubscribe();
    }

    this.asistenciaService.suscripcionParte().subscribe({
      next:(partes)=>{
        this.partes = partes
      }
    })
  }

  private suscripcionMateria(){
    if (this.suscriberMateria) {
      this.suscriberMateria.unsubscribe();
    }


    this.materiasService.suscripcionMateria().subscribe({
      next:(materia)=>{
        this.materia = materia
        this.obtenerPartes()
      }
    })
  }

  obtenerPartes(){
    this.asistenciaService.obtenerPartes(this.materia!)
  }

  verParte(parte:parte){
    this.router.navigate(['dashboard','asistencia','ver', parte.fecha,parte.id])
  }
}
