import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicadosService } from '../comunicados.service';
import { comunicado } from '../comunicado';
import { Observable, Subject, Subscription, of, shareReplay, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-comunicados-recibidos',
  templateUrl: './comunicados-recibidos.component.html',
  styleUrls: ['./comunicados-recibidos.component.css']
})
export class ComunicadosRecibidosComponent implements OnInit, OnDestroy{

  comunicados$?:Observable<comunicado[]> = of([])
  collapsedStatus: boolean[] = [];
  comunicadoSuscripcion?:Subscription
  filtrovalor:string = 'todos'


  constructor(private comunicadoService:ComunicadosService){

  }

  ngOnInit(): void {
    this.comunicadoSuscripcion = this.obtenerTodos().subscribe()
  }

  ngOnDestroy(): void {
    this.comunicadoSuscripcion?.unsubscribe()
  }

  obtenerNoLeidos(){
    return this.comunicadoService.obtenerNoLeidos().pipe(
      tap(comunicados =>this.comunicados$ = of(comunicados)),
      shareReplay(1)
    )
  }

  obtenerLeidos(){
    return this.comunicadoService.obtenerLeidos().pipe(
      tap(comunicados =>this.comunicados$ = of(comunicados)),
      shareReplay(1)
    )
  }

  obtenerTodos(){
    return this.comunicadoService.obtenerTodos().pipe(
      tap(comunicados =>this.comunicados$ = of(comunicados)),
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
                this.comunicadoSuscripcion = this.obtenerTodos().subscribe()
                break;
              case 'noLeidos':
                this.comunicadoSuscripcion = this.obtenerNoLeidos().subscribe()
                break;
              case 'leidos':
                this.comunicadoSuscripcion = this.obtenerLeidos().subscribe()
                break;
              default:
                this.comunicadoSuscripcion = this.obtenerTodos().subscribe()
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
        case'todos':
        this.comunicadoSuscripcion = this.obtenerTodos().subscribe()
        break;
        case'noLeidos':
        this.comunicadoSuscripcion = this.obtenerNoLeidos().subscribe()
        break;
        case'leidos':
        this.comunicadoSuscripcion = this.obtenerLeidos().subscribe()
        break;
        default:
          this.comunicadoSuscripcion = this.obtenerTodos().subscribe()
        break;
    }

  }
}
