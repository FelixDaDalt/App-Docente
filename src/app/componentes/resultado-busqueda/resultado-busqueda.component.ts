import { HomeService } from 'src/app/componentes/home/home.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { resultadoBusqueda } from '../home/home';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of, tap } from 'rxjs';
import { EstudianteLegajoService } from '../estudiante-legajo/estudiante-legajo.service';

@Component({
  selector: 'app-resultado-busqueda',
  templateUrl: './resultado-busqueda.component.html',
  styleUrls: ['./resultado-busqueda.component.css']
})
export class ResultadoBusquedaComponent implements OnInit, OnDestroy{

  private suscripcionBusqueda?:Subscription;

  resultadoBusqueda$:Observable<resultadoBusqueda[]> = of([])

  terminoBusqueda:string=""

  constructor(private homeService:HomeService,
    private route: ActivatedRoute,
    private router:Router,
    private legajoService:EstudianteLegajoService){


    this.route.params.subscribe(params => {
      this.terminoBusqueda = params['termino'];

    });
  }

  ngOnInit(): void {
    this.suscripcionBusqueda = this.Busqueda().subscribe()
  }

  ngOnDestroy(): void {
    this.suscripcionBusqueda?.unsubscribe()
  }

  private Busqueda(){
    return this.homeService.suscripcionBusqueda().pipe(
      tap(resultado => this.resultadoBusqueda$ = of(resultado))
    )
  }

  verEstudiante(alumno:resultadoBusqueda){
    this.suscripcionBusqueda?.unsubscribe()
    this.legajoService.setIdEstudiante(alumno)
    this.router.navigate(['dashboard','legajo-alumno']);
  }

}
