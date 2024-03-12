import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicadosService } from './comunicados.service';
import { comunicado } from './comunicado';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.component.html',
  styleUrls: ['./comunicados.component.css']
})
export class ComunicadosComponent implements OnInit, OnDestroy{

  comunicados:comunicado[]=[]
  todos=true
  collapsedStatus: boolean[] = [];
  private ngUnsuscribe  = new Subject();

  constructor(private comunicadoService:ComunicadosService){

  }

  ngOnInit(): void {
    this.obtenerTodos()
  }

  ngOnDestroy(): void {
    this.ngUnsuscribe.next(null)
    this.ngUnsuscribe.complete()
  }

  obtenerNoLeidos(){
    this.comunicadoService.obtenerNoLeidos()
    .pipe(takeUntil(this.ngUnsuscribe))
    .subscribe({
      next:(comunicados)=>{
        this.comunicados = comunicados
        this.todos = false
      }
    })
  }

  obtenerLeidos(){
    this.comunicadoService.obtenerLeidos()
    .pipe(takeUntil(this.ngUnsuscribe))
    .subscribe({
      next:(comunicados)=>{
        this.comunicados = comunicados
        this.todos = false
      }
    })
  }

  obtenerTodos(){
    this.comunicadoService.obtenerTodos()
    .pipe(takeUntil(this.ngUnsuscribe))
    .subscribe({
      next:(comunicados)=>{
        this.comunicados = comunicados
        this.todos = true
      }
    })
  }

  esImagen(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Puedes ampliar esta lista según tus necesidades
    const extension = url.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  }

  marcarLeido(comunicado:comunicado){
      if(comunicado.leido===0){
        this.comunicadoService.marcarLeido(comunicado.id)
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
    switch(valor)
    {
      case'todos':
        this.obtenerTodos()
        break;
        case'noLeidos':
        this.obtenerNoLeidos()
        break;
        case'leidos':
        this.obtenerLeidos()
        break;
        default:
        this.obtenerTodos()
        break;
    }

  }
}
