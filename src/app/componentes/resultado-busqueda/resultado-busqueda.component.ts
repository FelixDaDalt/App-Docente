import { HomeService } from 'src/app/componentes/home/home.service';
import { Component } from '@angular/core';
import { resultadoBusqueda } from '../home/home';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudianteLegajoService } from './estudiante-legajo/estudiante-legajo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resultado-busqueda',
  templateUrl: './resultado-busqueda.component.html',
  styleUrls: ['./resultado-busqueda.component.css']
})
export class ResultadoBusquedaComponent {

  private suscriberBusqueda:Subscription | undefined;
  resultadoBusqueda:resultadoBusqueda[]=[]
  terminoBusqueda:string=""

  constructor(private homeService:HomeService,
    private route: ActivatedRoute,
    private router:Router,
    private legajoService:EstudianteLegajoService){
    this.suscripcionBusqueda()
    this.obtenerBusqueda()
    this.route.params.subscribe(params => {
    this.terminoBusqueda = params['termino'];

    });
  }

  private suscripcionBusqueda(){
    this.suscriberBusqueda = this.homeService.suscripcionBusqueda().subscribe({
      next:(resultado)=>{
        this.resultadoBusqueda = resultado
      }
    })
  }

  private obtenerBusqueda(){
    this.homeService.obtenerBusqueda()
  }

  verEstudiante(alumno:resultadoBusqueda){
    this.suscriberBusqueda?.unsubscribe()
    this.legajoService.setIdEstudiante(alumno)
    this.router.navigate(['/legajo-alumno']);
  }

}
