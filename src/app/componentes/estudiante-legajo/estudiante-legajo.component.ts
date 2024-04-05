import { EstudianteLegajoService } from './estudiante-legajo.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { academico, legajoAlumno } from './legajo';
import { Observable, Subscription, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-legajo',
  templateUrl: './estudiante-legajo.component.html',
  styleUrls: ['./estudiante-legajo.component.css']
})
export class EstudianteLegajoComponent implements OnInit,OnDestroy{

  estudianteLegajo$:Observable<legajoAlumno | null>=of(null)
  private legajoSubscription?: Subscription;

  constructor(private legajoService:EstudianteLegajoService,
    private route:Router){

  }

  ngOnInit(): void {
    this.legajoSubscription = this.obtenerLegajo().subscribe()
  }

  ngOnDestroy(): void {
    this.legajoSubscription?.unsubscribe()
  }

  private obtenerLegajo(){
    return this.legajoService.suscripcionLegajo().pipe(
      tap(legajo=>{
          this.estudianteLegajo$ = of(legajo)
      })
    )
  }

  calcularEdad(birthDateString: string): number {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
