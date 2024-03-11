import { Component, OnDestroy, OnInit } from '@angular/core';
import { MensajeriaService } from './mensajeria.service';
import { mensajeria } from './mensajeria';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-mensajeria',
  templateUrl: './mensajeria.component.html',
  styleUrls: ['./mensajeria.component.css']
})
export class MensajeriaComponent implements OnInit,OnDestroy{

  listaMensajeria:mensajeria[]=[]
  listaMensajeria$?:Subscription

  constructor(private mensajeriaService:MensajeriaService){

  }

  ngOnInit(): void {
    this.suscripcionMensajeria()
  }
  ngOnDestroy(): void {

  }

  private suscripcionMensajeria(){
    if(this.listaMensajeria$)
      this.listaMensajeria$.unsubscribe()

    this.listaMensajeria$ = this.mensajeriaService.SubscriptionMensajeria()
      .subscribe({
      next:(respuesta)=>{
        this.listaMensajeria = respuesta
        this.ordenarPorFecha()
      }
    })
  }

  ordenarPorFecha(){
    this.listaMensajeria.sort((a, b) => {
      // Asegurar que son fecha
      const fechaHoraA = new Date(a.fecha + ' ' + a.hora);
      const fechaHoraB = new Date(b.fecha + ' ' + b.hora);

      // Compara las fechas
      return fechaHoraB.getTime() - fechaHoraA.getTime();
    });
  }

  calcularTiempoTranscurrido(fechaMensaje: string, horaMensaje: string): string {
    const fechaMensajeCompleta = parseISO(`${fechaMensaje}T${horaMensaje}`);


    const diferencia = Date.now() - fechaMensajeCompleta.getTime();

    if (diferencia < 60000) {
      return `Hace menos de un minuto`;
    } else if (diferencia < 3600000) {
      const minutosTranscurridos = Math.floor(diferencia / 60000);
      return `Hace ${minutosTranscurridos} minutos`;
    } else if (diferencia < 86400000) {
      const horasTranscurridas = Math.floor(diferencia / 3600000);
      return `Hace ${horasTranscurridas} horas`;
    } else if (diferencia < 172800000) {
      return "Ayer";
    } else {
      return format(fechaMensajeCompleta, "dd/MM/yyyy"); // Puedes ajustar el formato según tus preferencias
    }
  }

    // Función para formatear el nombre
    formatearNombre(nombreCompleto: string): string {
      const indiceParentesis = nombreCompleto.indexOf('(');
      if (indiceParentesis !== -1) {
        const nombreCortado = nombreCompleto.substring(0, indiceParentesis).trim();
        const nombreEnCapitalCase = this.convertirACapitalCase(nombreCortado);
        return nombreEnCapitalCase;
      } else {
        return this.convertirACapitalCase(nombreCompleto);
      }
    }

    // Función para convertir a capital case
    convertirACapitalCase(texto: string): string {
      return texto.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

}
