import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleDocumentacion } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-not-documentacion',
  templateUrl: './not-documentacion.component.html',
  styleUrls: ['./not-documentacion.component.css']
})
export class NotDocumentacionComponent implements OnInit,OnDestroy{
  detallesDocumentacion$:Observable<DetalleDocumentacion[]>=of([])
  cantidad$:Observable<number> = of(0)
  suscripcionDocumentacion?:Subscription

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.suscripcionDocumentacion?.unsubscribe()
  }


  private obtenerNotificciones(){
    this.suscripcionDocumentacion = this.notificacionService.obtenerDocumentacion()
      .pipe(
        tap(documentacionInfo=>{
          this.cantidad$ = of(documentacionInfo?.documentaciones || 0)
          this.detallesDocumentacion$ = of(documentacionInfo?.detalle_documentaciones || [])
        })
      )
    .subscribe();
  }

  marcarLeido(documentacion:DetalleDocumentacion){
    if(documentacion.leido===0){
      this.notificacionService.marcarLeido(documentacion.id)
    }
  }

  descargarAdjunto(url:string): void {
    window.open(url, '_blank');
  }

  obtenerNombreArchivo(url: string): string {
    const partes = url.split('/');
    return partes.pop() || ''; // Si el array está vacío, devuelve una cadena vacía
  }



}
