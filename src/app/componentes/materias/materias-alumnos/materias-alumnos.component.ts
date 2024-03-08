import { HomeService } from 'src/app/componentes/home/home.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MateriasService } from '../materias.service';
import { alumno, materias } from '../../home/home';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-materias-alumnos',
  templateUrl: './materias-alumnos.component.html',
  styleUrls: ['./materias-alumnos.component.css']
})
export class MateriasAlumnosComponent implements OnInit,OnDestroy{
  alumnos:alumno[]=[]
  materia?:materias | null
  suscriberMateria?:Subscription
  suscriberAlumnos?:Subscription
  suscripcionesActivas=0

  constructor(private homeService:HomeService,
    private materiasService:MateriasService){

  }

  ngOnInit(): void {
    this.suscripcionMateria()
    this.suscripcionAlumnos()
  }

  ngOnDestroy(): void {
    this.suscriberAlumnos?.unsubscribe()
    this.suscriberMateria?.unsubscribe()
  }


  private suscripcionAlumnos(){
    if (this.suscriberAlumnos) {
      this.suscriberAlumnos.unsubscribe();
    }

    this.suscriberAlumnos = this.homeService.suscripcionAlumnos().subscribe({
      next:(alumnos)=>{
        this.alumnos = alumnos.sort((a, b) => {
          return a.apellido.localeCompare(b.apellido);
        })
      }
    })
  }

  private suscripcionMateria(){
    if (this.suscriberMateria) {
      this.suscriberMateria.unsubscribe();
    }

    this.suscriberMateria = this.materiasService.suscripcionMateria().subscribe({
      next:(materia)=>{
        this.materia = materia
        if(this.materia)
          this.homeService.obtenerAlumnos(this.materia?.id,this.materia?.tipo_materia)
      }
    })
  }
}
