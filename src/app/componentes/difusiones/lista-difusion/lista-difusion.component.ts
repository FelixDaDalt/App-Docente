import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, shareReplay, take } from 'rxjs';
import { ComunicadosEnviadosDestinatariosComponent } from 'src/app/componentes/comunicados/comunicados-enviados/comunicados-enviados-destinatarios/comunicados-enviados-destinatarios.component';
import { difusion, Destinatario } from '../difusion';
import { DifusionService } from '../difusiones.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lista-difusion',
  templateUrl: './lista-difusion.component.html',
  styleUrls: ['./lista-difusion.component.css']
})
export class ListaDifusionComponent {
  difusiones = this.difusionService.difusiones$.pipe(shareReplay(1)) || of([])
  difusionDetalle = this.difusionService.difusion$.pipe(shareReplay(1))

  constructor(private difusionService:DifusionService,
    private modalService:NgbModal,
    private router:Router,
    private route:ActivatedRoute
  ){
    this.difusionService.actualizar()
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  obtenerEstilosBarra(comunicado:difusion): any {
    const porcentaje = comunicado.coeficiente_lectura * 100 || 0;
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

  obtenerDetalle(difusion:difusion){
    this.difusionService.leerDifusion(difusion)
  }

  esImagen(url: string): boolean {
    const extension = this.obtenerExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension.toLowerCase());
  }

  esVideo(url: string): boolean {
    const extension = this.obtenerExtension(url);
    return ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension.toLowerCase());
  }

  private obtenerExtension(url: string): string {
    return url.split('.').pop() || '';
  }

  verDestinatarios(destinatarios:Destinatario[]){
    if(destinatarios && destinatarios.length>0)
    {
      const modalRef = this.modalService.open(ComunicadosEnviadosDestinatariosComponent,{
        size: 'lg'
      });
      modalRef.componentInstance.destinatarios = destinatarios
    }
  }

  editar(difusion:difusion){
    this.difusionService.editar(difusion)
    this.router.navigate(['editar'],{relativeTo:this.route})
  }

  eliminar(difusion:difusion){
    this.difusionService.borrarDifusion(difusion.id).pipe(take(1)).subscribe()
  }
}
