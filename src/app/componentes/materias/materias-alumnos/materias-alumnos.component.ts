import { HomeService } from 'src/app/componentes/home/home.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { alumno, materias } from '../../home/home';
import { Observable, Subscription, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-materias-alumnos',
  templateUrl: './materias-alumnos.component.html',
  styleUrls: ['./materias-alumnos.component.css']
})
export class MateriasAlumnosComponent implements OnInit,OnDestroy{
  alumnos$:Observable<alumno[]>=of([])
  @Input() materia:Observable<materias | null> = of(null)
  suscriberMateria?:Subscription
  suscriberAlumnos?:Subscription


  constructor(private homeService:HomeService){

  }

  ngOnInit(): void {
    this.suscriberMateria = this.materia.subscribe({
      next:(materia)=>{
        if(materia)
        {
          this.suscriberAlumnos = this.suscricionAlumnos().subscribe()
          this.obtenerAlumnos(materia.id,materia.tipo_materia)
        }

      }
    })
  }

  ngOnDestroy(): void {
    this.suscriberAlumnos?.unsubscribe()
    this.suscriberMateria?.unsubscribe()
  }


  private suscricionAlumnos(){
    return this.homeService.suscripcionAlumnos().pipe(
      map(alumnos => alumnos.sort((a, b) => {
        return a.apellido.localeCompare(b.apellido);
      })),
      tap(alumnos => this.alumnos$ = of(alumnos))
    )
  }

  private obtenerAlumnos(materiaId:number,materiaTipo:string){
    this.homeService.obtenerAlumnos(materiaId,materiaTipo)
  }

}
