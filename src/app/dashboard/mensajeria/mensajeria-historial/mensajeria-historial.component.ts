import { ActivatedRoute, Router } from '@angular/router';
import { MensajeriaService } from './../mensajeria.service';
import { Component,OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked, HostListener  } from '@angular/core';
import { mensajeria_historial } from '../mensajeria';
import { destinatario } from '../destinatarios/destinatario';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { format, parseISO } from 'date-fns';
import { MensajeInformacionComponent } from '../mensaje-informacion/mensaje-informacion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mensajeria-historial',
  templateUrl: './mensajeria-historial.component.html',
  styleUrls: ['./mensajeria-historial.component.css']
})
export class MensajeriaHistorialComponent implements OnInit, OnDestroy, AfterViewChecked{
  @ViewChild('scrollContainer', { read: ElementRef })
  public scroll?: ElementRef<any>;

  historial:mensajeria_historial[]=[]
  historial$?:Subscription
  nuevoDestinatario?:destinatario | null
  nuevoDestinatario$?:Subscription
  enviarchat$?:Subscription

  mensajesAgrupados: { [fecha: string]: mensajeria_historial[] } = {};
  fechasMensajesAgrupados: string[] = [];
  usuarioDestino:string=""
  idChat?:number

  private scrollBool=false


  constructor(private mensajeriaService:MensajeriaService,
    private route: ActivatedRoute,
    private router:Router,
    private modalService:NgbModal)
    { }

    @HostListener('document:mousewheel', ['$event'])
    onDocumentMousewheelEvent(event: WheelEvent) {
      if (this.scroll) {
        if (this.scroll.nativeElement.scrollTop !== this.scroll.nativeElement.scrollHeight) {
          this.scrollBool = true;
        }
      }
    }

    @HostListener('document:touchstart', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onDocumentTouchEvent(event: TouchEvent) {
      if (this.scroll) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (this.scroll.nativeElement.scrollTop !== this.scroll.nativeElement.scrollHeight) {
          this.scrollBool = true;
        }
      }
    }


  ngAfterViewChecked(): void {
    this.scrollBottom()
  }



    ngOnInit(): void {
    this.obtenerNuevoDestinatario()
    this.suscripcionHistorial()

    this.route.queryParams
    .subscribe(params => {
      this.idChat = params['id_chat']
      if(this.idChat!=undefined)
      {
        this.marcarLeido(this.idChat)
        this.obtenerHistorial(this.idChat)
      }
    });
  }

  ngOnDestroy() {
    this.historial$?.unsubscribe()
    this.nuevoDestinatario$?.unsubscribe()
    this.enviarchat$?.unsubscribe()
  }

  private marcarLeido(idChat:number){
    this.mensajeriaService.marcarLeido(idChat)
  }

  private obtenerNuevoDestinatario(){
    if(this.nuevoDestinatario$)
      this.nuevoDestinatario$.unsubscribe()

    this.nuevoDestinatario$ = this.mensajeriaService.obtenerNuevoDestinatario()
      .subscribe({
        next:(destinatario)=>{
        this.nuevoDestinatario = destinatario
        this.usuarioDestino = this.nuevoDestinatario?.responsables[0].nombre ?? ''
      }
    })
  }

  private suscripcionHistorial(){
    if(this.historial$)
      this.historial$.unsubscribe()

    this.historial$ = this.mensajeriaService.SuscripcionHistorial().subscribe({
      next:(mensajeriaHistorial)=>{
        this.historial = mensajeriaHistorial
        this.agruparMensajesPorFecha()
      }
    })
  }

  private obtenerHistorial(id_chat:number){
    this.mensajeriaService.obtenerHistorial(id_chat)
  }


  private agruparMensajesPorFecha() {
    this.mensajesAgrupados = {}
    this.historial.forEach((mensaje) => {
      if (!this.mensajesAgrupados[mensaje.fecha]) {
        this.mensajesAgrupados[mensaje.fecha] = [];
      }
      if (this.nuevoDestinatario==null) {
        this.usuarioDestino = mensaje.usuario_destino;
      }
      this.mensajesAgrupados[mensaje.fecha].push(mensaje);
    });
    this.fechasMensajesAgrupados = Object.keys(this.mensajesAgrupados);
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

  enviarChat(mensaje:string){
    if(this.idChat!=undefined){
      let chat={chat:mensaje,id_chat:this.idChat}
      this.mensajeriaService.enviarChat(chat)
      this.scrollBool = false
    }else{
      this.enviarNuevoDestinatario(mensaje)
      this.scrollBool = false
    }
  }

  private enviarNuevoDestinatario(mensaje:string){
    if(this.enviarchat$)
      this.enviarchat$.unsubscribe()

    this.enviarchat$ = this.mensajeriaService.enviarChatNuevo(this.nuevoDestinatario!,mensaje)
      .subscribe({
      next:(idChat)=>{
        if(idChat != -1){
          this.idChat = idChat
          this.obtenerHistorial(idChat)
        }
      }
    })
  }


  volver(){
    this.mensajeriaService.borrarDestinatario()
    this.router.navigate(['dashboard','mensajeria'])
  }

  mostrarInformacion(mensaje: any) {
    const modalRef = this.modalService.open(MensajeInformacionComponent,{
      size: 'lg'
    });
    modalRef.componentInstance.mensaje = mensaje

  }

  public scrollBottom() {
    if(this.scroll && !this.scrollBool){
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    }
  }


}


