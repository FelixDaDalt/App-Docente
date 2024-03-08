import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LibroTemaService } from '../../libro-tema/libro-tema.service';
import { libroTema } from '../../libro-tema/libro-tema';
import { materias } from '../../home/home';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AusentesComponent } from '../../libro-tema/ausentes/ausentes.component';
import { MateriasService } from '../materias.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-materias-libro-temas',
  templateUrl: './materias-libro-temas.component.html',
  styleUrls: ['./materias-libro-temas.component.css']
})
export class MateriasLibroTemasComponent implements OnInit,OnDestroy{

  private suscriberLibroTema?:Subscription
  private suscriberMateria?:Subscription
  suscripcionesActivas=0

  libroTemas:libroTema[]=[]
  private materia?:materias | null

  constructor(private libroTemaService:LibroTemaService,
    private modalService:NgbModal,
    private materiasService:MateriasService){

  }
  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe()
    this.suscriberLibroTema?.unsubscribe()
  }

  ngOnInit(): void {
    this.suscripcionMateria()
  }

  suscripcionMateria(){
    if (this.suscriberMateria) {
      this.suscriberMateria.unsubscribe();
    }

   this.suscriberMateria = this.materiasService.suscripcionMateria().subscribe({
      next:(materia)=>{
        this.materia = materia
        this.obtenerLibroTemas()
      }
    })
  }

  private obtenerLibroTemas(){
      if (this.suscriberLibroTema) {
        this.suscriberLibroTema.unsubscribe();
      }

      this.suscriberLibroTema = this.libroTemaService.obtenerRegistros(this.materia!).subscribe({
        next:(libroTemas)=> {
          this.libroTemas = libroTemas
        }
      })
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
