import { ActivatedRoute, Router } from '@angular/router';
import { MensajeriaService } from './../mensajeria.service';
import { Component,OnDestroy, OnInit, ViewChild, ElementRef, AfterViewChecked  } from '@angular/core';
import { mensajeria_historial } from '../mensajeria';
import { destinatario } from '../destinatarios/destinatario';
import { Subject, takeUntil } from 'rxjs';
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
  mensajesAgrupados: { [fecha: string]: mensajeria_historial[] } = {};
  fechasMensajesAgrupados: string[] = [];
  usuarioDestino:string=""
  idChat?:number
  nuevoDestinatario?:destinatario | null

  private ngUnsubscribe = new Subject<void>();

  constructor(private mensajeriaService:MensajeriaService,
    private route: ActivatedRoute,
    private router:Router,
    private modalService:NgbModal)
    { }


  ngAfterViewChecked(): void {
    this.scrollBottom()
  }



    ngOnInit(): void {
    this.obtenerNuevoDestinatario()

    this.route.queryParams
    .pipe(takeUntil(this.ngUnsubscribe))
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
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  private marcarLeido(idChat:number){
    this.mensajeriaService.marcarLeido(idChat)
  }



  private obtenerNuevoDestinatario(){
    this.mensajeriaService.obtenerNuevoDestinatario()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next:(destinatario)=>{
        this.nuevoDestinatario = destinatario
        this.usuarioDestino = this.nuevoDestinatario?.responsables[0].nombre ?? ''
      }
    })
  }

  private obtenerHistorial(id_chat:number){
    this.mensajeriaService.obtenerHistorial(id_chat)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
      next:(mensajeriaHistorial)=>{
        this.historial = mensajeriaHistorial
        this.agruparMensajesPorFecha()
      }
    })
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
    }else{
      this.enviarNuevoDestinatario(mensaje)
    }
  }

  private enviarNuevoDestinatario(mensaje:string){
    this.mensajeriaService.enviarChatNuevo(this.nuevoDestinatario!,mensaje)
      .pipe(takeUntil(this.ngUnsubscribe))
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
    this.router.navigate(['/mensajeria'])
  }

  mostrarInformacion(mensaje: any) {
    const modalRef = this.modalService.open(MensajeInformacionComponent,{
      size: 'lg'
    });
    modalRef.componentInstance.mensaje = mensaje

  }

  public scrollBottom() {
    if(this.scroll)
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;

  }
}
