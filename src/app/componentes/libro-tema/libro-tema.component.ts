import { LibroTemaService } from './libro-tema.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { libroTema, nuevo_registro, tipoClase, AlumnoAusente } from './libro-tema';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { parseJSON } from 'date-fns';
import { HomeService } from '../home/home.service';
import { materias } from '../home/home';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AusentesComponent } from './ausentes/ausentes.component';

@Component({
  selector: 'app-libro-tema',
  templateUrl: './libro-tema.component.html',
  styleUrls: ['./libro-tema.component.css']
})
export class LibroTemaComponent implements OnInit, OnDestroy{
  tiposClases:tipoClase[]=[]
  registros:libroTema[]=[]
  materias:materias[]=[]
  materiaSeleccionada?:materias
  tipoClaseSeleccionada?:tipoClase

  fechaRegistro?:string
  contenidoRegistro?:string
  actividadRegistro?:string

  materiasSuscripcion?:Subscription

  private ngUnsuscribe  = new Subject();

  constructor(private libroTemaService:LibroTemaService,
    private homeService:HomeService,
    private modalService:NgbModal){

  }

  ngOnInit(): void {
    this.obtenerMaterias()
    this.obtenerTiposClases()
  }

  private obtenerMaterias(){
    if(this.materiasSuscripcion){
      this.materiasSuscripcion.unsubscribe()
    }

    this.materiasSuscripcion = this.homeService.suscribirseMaterias().subscribe({
      next:(materias)=>{
        if(materias.length>0){
          this.materias = materias
          this.materiaSeleccionada = this.materias[0]
          this.obtenerRegistros()
          this.materiasSuscripcion?.unsubscribe()
        }

      }
    })
  }

  private obtenerTiposClases(){
    this.libroTemaService.obtenerTiposClases()
    .pipe(takeUntil(this.ngUnsuscribe))
    .subscribe({
      next:(respuesta)=>{
        this.tiposClases = respuesta
        this.tipoClaseSeleccionada = this.tiposClases[0]
      }
    })
  }

  obtenerRegistros(){
    if(this.materiaSeleccionada){
      this.libroTemaService.obtenerRegistros(this.materiaSeleccionada)
      .pipe(takeUntil(this.ngUnsuscribe))
      .subscribe({
        next:(respuesta)=>{
          this.registros = respuesta
        }
      })
    }
  }


  nuevoRegistro(formulario: NgForm){
     if(this.materiaSeleccionada && this.tipoClaseSeleccionada){
      let nuevoRegistro = new nuevo_registro(this.materiaSeleccionada.id,this.materiaSeleccionada.tipo_materia,this.fechaRegistro!,this.tipoClaseSeleccionada.tipo,this.contenidoRegistro!,this.actividadRegistro!)
      nuevoRegistro.materia = this.materiaSeleccionada
      this.libroTemaService.agregarRegistro(nuevoRegistro)
      formulario.resetForm()
    }


  }

  ngOnDestroy(): void {
    this.ngUnsuscribe.next(null)
    this.ngUnsuscribe.complete()
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
