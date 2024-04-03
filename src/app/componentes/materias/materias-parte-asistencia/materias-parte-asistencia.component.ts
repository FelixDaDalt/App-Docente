import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsistenciaService } from '../../asistencia/asistencia.service';
import { parte } from '../../asistencia/asistencia';
import { MateriasService } from '../materias.service';
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
  materia$?:Observable<materias | null> = of(null)
  partes$:Observable<parte[]>=of([])

  constructor(private asistenciaService:AsistenciaService,
    private materiasService:MateriasService,
    private router:Router){

  }

  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe()
    this.suscriberParte?.unsubscribe()
  }

  ngOnInit(): void {
    this.suscripcionMateria()
  }

  private obtenerPartes(materia:materias){
    this.suscriberParte = this.asistenciaService.obtenerPartesPorMateria(materia)
    .pipe(
      tap(partes => this.partes$ = of(partes))
    ).subscribe()
  }

  private suscripcionMateria() {
  this.suscriberMateria = this.materiasService.suscripcionMateria()
    .pipe(
      tap(materia => {
        this.materia$ = of(materia)
        if(materia)
          this.obtenerPartes(materia)
      })
    )
    .subscribe();
}

  verParte(parte:parte){
    this.router.navigate(['dashboard','asistencia','ver', parte.fecha,parte.id])
  }
}
