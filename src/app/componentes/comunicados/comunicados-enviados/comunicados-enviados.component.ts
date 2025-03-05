import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicadosService } from '../comunicados.service';
import { comunicado_enviado, comunicado_enviado_Destinatario } from './comunicado-enviado';
import { Observable, Subject, Subscription, of, shareReplay, takeUntil, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComunicadosEnviadosDestinatariosComponent } from './comunicados-enviados-destinatarios/comunicados-enviados-destinatarios.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comunicados-enviados',
  templateUrl: './comunicados-enviados.component.html',
  styleUrls: ['./comunicados-enviados.component.css']
})
export class ComunicadosEnviadosComponent implements OnInit,OnDestroy{

  comunicadosEnviados$:Observable<comunicado_enviado[]>=of([])
  private comunicadosEnviadosSuscripcion?:Subscription

  constructor(private comunicadosService:ComunicadosService,
    private modalService:NgbModal,
    private route:Router){}

  ngOnInit(): void {
    this.comunicadosEnviadosSuscripcion = this.obtenerComunicados().subscribe()
  }

  ngOnDestroy(): void {
    this.comunicadosEnviadosSuscripcion?.unsubscribe()
  }

  private obtenerComunicados(){
   return this.comunicadosService.obtenerComunicadosEnviados()
      .pipe(
        tap(comunicados => this.comunicadosEnviados$ = of(comunicados)),
        shareReplay(1)
      )
  }

  esImagen(url: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif']; // Puedes ampliar esta lista según tus necesidades
    const extension = url.split('.').pop()?.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
  }

  descargarAdjunto(url:string): void {
    window.open(url, '_blank');
  }

   obtenerEstilosBarra(comunicado:comunicado_enviado): any {
    const porcentaje = comunicado.porcentaje_lectura || 0;
    const anchoMinimo = 10; // Puedes ajustar el ancho mínimo según tus preferencias

    // Garantizar que el ancho mínimo no sea menor al porcentaje actual
    const ancho = Math.max(anchoMinimo, porcentaje);

    return { width: `${ancho}%`, backgroundColor: this.obtenerColor(ancho) };
  }

  obtenerColor(porcentaje: number): string {
    // Lógica para determinar el color basado en el porcentaje
    if (porcentaje < 25) {
      return '#dc3545';
    } else if (porcentaje < 50) {
      return '#ffc107';
    } else if (porcentaje < 75) {
      return '#0d6efd';
    } else {
      return '#198754';
    }
  }

  verDestinatarios(destinatarios:comunicado_enviado_Destinatario[]){
    if(destinatarios && destinatarios.length>0)
    {
      const modalRef = this.modalService.open(ComunicadosEnviadosDestinatariosComponent,{
        size: 'lg'
      });
      modalRef.componentInstance.destinatarios = destinatarios
    }
  }

  eliminarComunicado(idComunicado:number){
    const eliminarSuscripcion = this.comunicadosService.borrarComunicado(idComunicado).subscribe({
      next:()=>{
        this.comunicadosEnviadosSuscripcion = this.obtenerComunicados().subscribe()
      },
      complete:()=>{
        eliminarSuscripcion.unsubscribe()
      }
    })
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  nuevoComunicado(){
    this.route.navigate(['dashboard', 'comunicados', 'nuevo-comunicado'])
  }
}
