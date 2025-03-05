import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicadosService } from '../comunicados.service';
import { comunicado } from '../comunicado';
import { Observable, Subject, Subscription, of, shareReplay, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-comunicados-recibidos',
  templateUrl: './comunicados-recibidos.component.html',
  styleUrls: ['./comunicados-recibidos.component.css']
})
export class ComunicadosRecibidosComponent implements OnInit{

  comunicados$?:Observable<comunicado[]> = of([])
  collapsedStatus: boolean[] = [];
  filtrovalor:string = 'todos'

  constructor(private comunicadoService:ComunicadosService){

  }

  ngOnInit(): void {
    this.obtenerTodos()
  }



  obtenerNoLeidos(){
    this.comunicados$ = this.comunicadoService.obtenerNoLeidos().pipe(
      take(1),
      shareReplay(1)
    )
  }

  obtenerLeidos(){
    this.comunicados$ = this.comunicadoService.obtenerLeidos().pipe(
      take(1),
      shareReplay(1)
    )
  }

  obtenerTodos(){
    this.comunicados$ = this.comunicadoService.obtenerTodos().pipe(
      take(1),
      shareReplay(1)
    )
  }

  esImagen(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Puedes ampliar esta lista según tus necesidades
    const extension = url.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  }

  marcarLeido(comunicado:comunicado){
      if(comunicado.leido===0){
        this.comunicadoService.marcarLeido(comunicado.id).subscribe({
          next:(respuesta)=>{
            switch (this.filtrovalor) {
              case 'todo':
                this.obtenerTodos()
                break;
              case 'noLeidos':
                this.obtenerNoLeidos()
                break;
              case 'leidos':
                this.obtenerLeidos()
                break;
              default:
                this.obtenerTodos()
                break;
            }
          }
        })
      }
  }

  descargarAdjunto(url:string): void {
    window.open(url, '_blank');
  }

  obtenerNombreArchivo(url: string): string {
    const partes = url.split('/');
    return partes.pop() || '';
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  filtro(value:Event){
    let valor = (value.target as HTMLSelectElement).value;
    this.filtrovalor = valor
    switch(valor)
    {
      case 'todo':
        this.obtenerTodos()
        break;
      case 'noLeidos':
        this.obtenerNoLeidos()
        break;
      case 'leidos':
        this.obtenerLeidos()
        break;
      default:
        this.obtenerTodos()
        break;
    }

  }
}
