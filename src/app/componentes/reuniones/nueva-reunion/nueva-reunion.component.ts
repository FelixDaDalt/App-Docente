import { Component, OnInit } from '@angular/core';
import { comunicado_destinatario, comunicado_destinatario_alumno } from '../../../dashboard/comunicados/comunicado';
import { Subject, map, takeUntil } from 'rxjs';
import { ComunicadosService } from '../../../dashboard/comunicados/comunicados.service';
import { Router } from '@angular/router';
import { nueva_Reunion } from '../reunion';
import { ReunionesService } from '../reuniones.service';
import { NotificacionService } from 'src/app/otros/notificacion-popup/notificacionpopup.service';


@Component({
  selector: 'app-nueva-reunion',
  templateUrl: './nueva-reunion.component.html',
  styleUrls: ['./nueva-reunion.component.css']
})
export class NuevaReunionComponent implements OnInit{
  listaComunicadoDestinatarios:comunicado_destinatario[]=[]
  grupoSeleccionado!:comunicado_destinatario

  destinatariosSeleccionado?:comunicado_destinatario_alumno
  acordeonAbierto = true;
  mensaje?:string

  private ngUnsuscribe=new Subject()

  constructor(private comunicadosService:ComunicadosService,
    private reunionesService:ReunionesService,
    private notificacionService:NotificacionService,
    private route:Router){

  }

  ngOnInit(): void {
    this.obtenerDestinatarios()
    this.getTextoPrederminado()
  }

  ngOnDestroy(): void {
    this.ngUnsuscribe.next(null)
    this.ngUnsuscribe.complete()
  }

  private getTextoPrederminado(){
    this.reunionesService.getTextoPredeterminado().
    pipe(
      map(texto => this.decodificarHTML(texto)
      )
    ).subscribe({
      next:(texto)=>{
        this.mensaje = texto
      }
    })
  }

  obtenerDestinatarios(){
    this.comunicadosService.obtenerDestinatarios()
    .pipe(takeUntil(this.ngUnsuscribe))
    .subscribe({
      next:(respuesta)=>{
        this.listaComunicadoDestinatarios = respuesta
      }
    })
  }


  decodificarHTML(textoCodificado: string) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = textoCodificado;
    return textarea.value;
  }


  toggleAcordeon() {
    this.acordeonAbierto = !this.acordeonAbierto;
  }

  enviar(titulo: string, fecha:string, hora:string) {
    const hayDestinatarios = this.destinatariosSeleccionado
    const tituloNoVacio = titulo.trim() !== '';
    const fechaNoVacio = fecha.trim() !== '';
    const horaNoVacio = hora.trim() !== '';
    const mensajeNoVacio = this.mensaje?.trim() !== '';

    if (hayDestinatarios && tituloNoVacio && mensajeNoVacio && fechaNoVacio && horaNoVacio) {
      const nuevaReunion = new nueva_Reunion(titulo,this.mensaje!,fecha,hora,this.destinatariosSeleccionado!.id_alumno)

      this.reunionesService.enviarReunion(nuevaReunion)
        .pipe(takeUntil(this.ngUnsuscribe))
        .subscribe({
          next: (respuesta) => {
            this.route.navigate(['dashboard','reuniones']);
          },
          error: (error) => {
            this.notificacionService.establecerNotificacion('Error', 'Error al enviar solicitud');
          }
        });

    } else {
      this.notificacionService.establecerNotificacion('Error', 'Error al enviar solicitud');
    }
  }

  capturarTexto(event:any): void {
    const textoEditado = event.target.innerHTML;
    this.mensaje = textoEditado
  }

  seleccionHora(hora:string){
    const regex = /HH:MM/g; // Expresión regular para buscar 'HH:MM'
    this.mensaje = this.mensaje?.replace(regex,hora);
  }

  seleccionFecha(fecha:string){
    const regex = /DD\/MM\/AAAA/g; // Expresión regular para buscar 'HH:MM'
    this.mensaje = this.mensaje?.replace(regex,fecha);
  }

  seleccionEstudiante(){
    const regex = /ZZZ/g; // Expresión regular para buscar 'HH:MM'
    this.mensaje = this.mensaje?.replace(regex,this.destinatariosSeleccionado!.alumno);
  }
}
