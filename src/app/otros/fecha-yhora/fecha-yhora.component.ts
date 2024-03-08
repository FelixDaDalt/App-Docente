import { Component } from '@angular/core';
import { FechaService } from 'src/app/servicios/fecha.service';

@Component({
  selector: 'app-fecha-yhora',
  templateUrl: './fecha-yhora.component.html',
  styleUrls: ['./fecha-yhora.component.css']
})
export class FechaYhoraComponent {

  fechaHora!:string

  constructor(private fechaService:FechaService){
    this.obtenerFecha()
  }

  obtenerFecha(){
    this.fechaService.getFechaYHora().subscribe({
      next:(fechaHora)=>{
        if(fechaHora)
          this.fechaHora = fechaHora
      }
    })
  }
}
