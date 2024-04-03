import { Component, OnDestroy, OnInit } from '@angular/core';
import { MensajeriaService } from '../mensajeria.service';
import { ResponsableDestinatario, destinatario } from './destinatario';
import { Router } from '@angular/router';
import { mensajeria } from '../mensajeria';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { takeUntil, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.css']
})
export class DestinatariosComponent implements OnInit, OnDestroy {

  listaMensajeria: mensajeria[] = [];
  listaMensajeria$?: Subscription;


  destinatarios: destinatario[] = [];
  destinatariosFiltrados: destinatario[] = [];
  destinatarios$?: Subscription;

  destinatariosResponsable?: ResponsableDestinatario[];
  destinatarioSeleccionado?: destinatario;
  private ngUnsubscribe = new Subject<void>();
  private searchTerm$ = new Subject<string>();

  constructor(private mensajeriaService: MensajeriaService, private router: Router) { }

  ngOnInit(): void {
    this.susripcionMensajeria();
    this.getMensajeria()
    this.suscripcionDestinatarios();
    this.obtenerDestinatarios();

    combineLatest([this.searchTerm$, this.mensajeriaService.suscripcionDestinatarios()])
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(300),
        distinctUntilChanged(),
        map(([term, destinatarios]) => {
          if (!term) {
            return destinatarios;
          }
          const searchTerm = term.toUpperCase();
          return destinatarios.filter(x =>
            x.apellido.toUpperCase().includes(searchTerm) || x.nombre.toUpperCase().includes(searchTerm)
          );
        })
      )
      .subscribe(filteredDestinatarios => {
        this.destinatariosFiltrados = filteredDestinatarios;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private susripcionMensajeria(): void {
    if(this.listaMensajeria$)
      this.listaMensajeria$.unsubscribe()

    this.listaMensajeria$ = this.mensajeriaService.SubscriptionMensajeria()
      .subscribe({
        next: (respuesta) => {
          this.listaMensajeria = respuesta;
        }
      });
  }

  private getMensajeria(){
    this.mensajeriaService.obtenerMensajeria()
  }

  private suscripcionDestinatarios(): void {
    if(this.destinatarios$)
      this.destinatarios$.unsubscribe()

    this.destinatarios$ = this.mensajeriaService.suscripcionDestinatarios()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (destinatarios) => {
          this.destinatarios = destinatarios;
          this.destinatariosFiltrados = destinatarios;
        }
      });
  }

  private obtenerDestinatarios(){
    this.mensajeriaService.obtenerDestinatarios()
  }

  filtrarDestinatarios(termino: string): void {
    this.searchTerm$.next(termino);
  }

  seleccionDestinatario(destinatario: destinatario): void {
    this.destinatarioSeleccionado = destinatario;
    this.destinatariosResponsable = destinatario.responsables;
  }

  seleccionResponsable(destinatarioResponsable: ResponsableDestinatario): void {
    if (this.destinatarioSeleccionado) {
      this.destinatarioSeleccionado.responsables = this.destinatarioSeleccionado.responsables.filter(
        (responsable) => responsable === destinatarioResponsable
      );
      this.mensajeriaService.establecerDestinatario(this.destinatarioSeleccionado);
      const existeMensajaria = this.listaMensajeria.find(x => x.id_chat === destinatarioResponsable.id_chat);
      if (existeMensajaria) {
        this.router.navigate(['dashboard','mensajeria','mensajeria-historial'], { queryParams: { id_chat: existeMensajaria.id_chat } });
        return;
      }
      this.nuevoChat();
    }
  }

  nuevoChat(): void {
    this.router.navigate(['dashboard','mensajeria','mensajeria-historial']);
  }
}
