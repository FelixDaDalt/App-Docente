import { ReunionesService } from './reuniones.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { reunion } from './reunion';
import { Observable, Subscription, of, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReagendarReunionComponent } from './reagendar-reunion/reagendar-reunion.component';

@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.component.html',
  styleUrls: ['./reuniones.component.css']
})
export class ReunionesComponent implements OnInit, OnDestroy{

  reuniones$:Observable<reunion[]>=of([])
  suscripcionReuniones?:Subscription

  constructor(private reunionesService:ReunionesService, private modalService:NgbModal){

  }

  ngOnDestroy(): void {
      this.suscripcionReuniones?.unsubscribe()
  }

  ngOnInit(): void {
    this.suscripcionReuniones = this.obtenerReuniones().subscribe()
  }

  obtenerReuniones(){
    return this.reunionesService.obtenerReuniones()
    .pipe(
      tap(reuniones => this.reuniones$ = of(reuniones))
    )
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  reprogramar(reunion:reunion){
    const modalRef = this.modalService.open(ReagendarReunionComponent,{
      size: 'lg'
    });
    modalRef.componentInstance.reunion = reunion
  }
}
