import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LibroTemaService } from '../../libro-tema/libro-tema.service';
import { libroTema } from '../../libro-tema/libro-tema';
import { materias } from '../../home/home';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AusentesComponent } from '../../libro-tema/ausentes/ausentes.component';
import { Observable, Subscription, of, tap } from 'rxjs';

@Component({
  selector: 'app-materias-libro-temas',
  templateUrl: './materias-libro-temas.component.html',
  styleUrls: ['./materias-libro-temas.component.css']
})
export class MateriasLibroTemasComponent implements OnInit,OnDestroy{

  private suscriberLibroTema?:Subscription
  private suscriberMateria?:Subscription
  libroTemas$:Observable<libroTema[]>=of([])

  @Input() materia:Observable<materias | null> = of(null)

  constructor(private libroTemaService:LibroTemaService,
    private modalService:NgbModal){

  }
  ngOnDestroy(): void {
    this.suscriberLibroTema?.unsubscribe()
    this.suscriberMateria?.unsubscribe()
  }

  ngOnInit(): void {
    this.suscriberMateria = this.materia.subscribe({
      next:(materia)=>{
        if(materia)
          this.suscriberLibroTema = this.obtenerLibroTemas(materia).subscribe()
      }
    })
  }

  private obtenerLibroTemas(materia:materias){
      return this.libroTemaService.obtenerRegistros(materia)
        .pipe(
          tap(libroTemas => this.libroTemas$ = of(libroTemas))
        )
  }

  verAusentes(registro:libroTema){
    if(registro.ausentes.length > 0){
      const modalRef = this.modalService.open(AusentesComponent,{
        size: 'lg'
      });
      modalRef.componentInstance.librotema = registro
    }
  }
}
