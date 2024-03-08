import { ReunionesService } from './reuniones.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { reunion } from './reunion';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReagendarReunionComponent } from './reagendar-reunion/reagendar-reunion.component';

@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.component.html',
  styleUrls: ['./reuniones.component.css']
})
export class ReunionesComponent implements OnInit, OnDestroy{

  reuniones?:reunion[]
  suscripcionReuniones?:Subscription

  constructor(private reunionesService:ReunionesService, private modalService:NgbModal){

  }

  ngOnDestroy(): void {
    if(this.suscripcionReuniones)
      this.suscripcionReuniones.unsubscribe()
  }

  ngOnInit(): void {
    this.getReuniones()
  }

  getReuniones(){
    if(this.suscripcionReuniones)
      this.suscripcionReuniones.unsubscribe()

    this.suscripcionReuniones = this.reunionesService.obtenerReuniones().subscribe({
      next:(reuniones)=>{
        this.reuniones = reuniones
      }
    })
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
