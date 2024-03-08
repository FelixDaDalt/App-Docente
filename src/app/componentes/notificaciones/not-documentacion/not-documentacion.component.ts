import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetalleDocumentacion } from '../notificacion';
import { NotificacionService } from '../notificacion.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-not-documentacion',
  templateUrl: './not-documentacion.component.html',
  styleUrls: ['./not-documentacion.component.css']
})
export class NotDocumentacionComponent implements OnInit,OnDestroy{
  detallesDocumentacion:DetalleDocumentacion[]=[]
  cantidad:number=0
  private ngUnsubscribe = new Subject();

  constructor(private notificacionService:NotificacionService){
  }

  ngOnInit(): void {
    this.obtenerNotificciones()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null)
    this.ngUnsubscribe.complete()
  }

  private obtenerNotificciones(){
    this.notificacionService.obtenerDocumentacion()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (documentacionInfo) => {
        if (documentacionInfo) {
          this.cantidad = documentacionInfo.documentaciones;
          this.detallesDocumentacion = documentacionInfo.detalle_documentaciones;
        }
      }
    });
  }

  descargarAdjunto(url:string): void {
    window.open(url, '_blank');
  }

  obtenerNombreArchivo(url: string): string {
    const partes = url.split('/');
    return partes.pop() || ''; // Si el array está vacío, devuelve una cadena vacía
  }

  marcarLeido(documentacion:DetalleDocumentacion){
    if(documentacion.leido===0){
      this.notificacionService.marcarLeido(documentacion.id)
    }
  }

}
