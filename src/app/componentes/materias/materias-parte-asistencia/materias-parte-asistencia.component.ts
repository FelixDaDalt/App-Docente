import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AsistenciaService } from '../../asistencia/asistencia.service';
import { parte } from '../../asistencia/asistencia';
import { Observable, Subscription, of, tap } from 'rxjs';
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
  @Input() materia:Observable<materias | null> = of(null)
  partes$:Observable<parte[]>=of([])

  constructor(private asistenciaService:AsistenciaService,
    private router:Router){

  }

  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe()
    this.suscriberParte?.unsubscribe()
  }

  ngOnInit(): void {
    this.suscriberMateria = this.materia.subscribe({
      next:(materia)=>{
        if(materia)
        this.suscriberParte = this.obtenerPartes(materia).subscribe()
      }
    })
  }

  private obtenerPartes(materia:materias){
    return this.asistenciaService.obtenerPartesPorMateria(materia)
    .pipe(
      tap(partes => this.partes$ = of(partes))
    )
  }

  verParte(parte:parte){
    this.router.navigate(['dashboard','asistencia','ver', parte.fecha,parte.id])
  }
}
