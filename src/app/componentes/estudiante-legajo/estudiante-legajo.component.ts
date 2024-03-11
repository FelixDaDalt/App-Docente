import { EstudianteLegajoService } from './estudiante-legajo.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { academico, legajoAlumno } from './legajo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estudiante-legajo',
  templateUrl: './estudiante-legajo.component.html',
  styleUrls: ['./estudiante-legajo.component.css']
})
export class EstudianteLegajoComponent implements OnInit,OnDestroy{

  estudianteLegajo?:legajoAlumno
  private legajoSubscription?: Subscription;
  academicoSeleccionado?:academico

  constructor(private legajoService:EstudianteLegajoService){

  }

  ngOnInit(): void {
    this.obtenerLegajo()
  }

  ngOnDestroy(): void {
    this.legajoSubscription?.unsubscribe()
  }

  private obtenerLegajo(){

    if(this.legajoSubscription){
      this.legajoSubscription.unsubscribe()
    }

    this.legajoSubscription = this.legajoService.suscripcionLegajo().subscribe({
      next:(legajo)=>{
        if(legajo){
          this.estudianteLegajo = legajo
        }
      }
    })
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
