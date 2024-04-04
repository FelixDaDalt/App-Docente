import { LibroTemaService } from './libro-tema.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { libroTema, nuevo_registro, tipoClase, AlumnoAusente } from './libro-tema';
import { Observable, Subject, Subscription, of, takeUntil, tap } from 'rxjs';
import { parseJSON } from 'date-fns';
import { HomeService } from '../home/home.service';
import { materias } from '../home/home';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AusentesComponent } from './ausentes/ausentes.component';

@Component({
  selector: 'app-libro-tema',
  templateUrl: './libro-tema.component.html',
  styleUrls: ['./libro-tema.component.css']
})
export class LibroTemaComponent implements OnInit, OnDestroy{

  registros$:Observable<libroTema[]>=of([])
  tiposClases$:Observable<tipoClase[]>=of([])
  materias$:Observable<materias[]>=of([])

  materiaSeleccionada?:materias
  tipoClaseSeleccionada?:tipoClase

  fechaRegistro?:string
  contenidoRegistro?:string
  actividadRegistro?:string

  materiasSuscripcion?:Subscription
  tipoClasesSuscripcion?:Subscription
  registrosSuscripcion?:Subscription

  formulario!: FormGroup;

  constructor(private libroTemaService:LibroTemaService,
    private homeService:HomeService,
    private modalService:NgbModal,
    private fb: FormBuilder){

  }

  ngOnInit(): void {
    this.formGroup()
    this.materiasSuscripcion = this.obtenerMaterias().subscribe()
    this.tipoClasesSuscripcion = this.obtenerTiposClases().subscribe()
  }

  ngOnDestroy(): void {
    this.materiasSuscripcion?.unsubscribe()
    this.tipoClasesSuscripcion?.unsubscribe()
    this.registrosSuscripcion?.unsubscribe()
  }

  private formGroup(){
    this.formulario = this.fb.group({
      id_materia: ['', Validators.required],
      tipo_materia: ['', Validators.required],
      materia: ['', Validators.required],
      fecha: ['', Validators.required],
      tipo_clase: ['', Validators.required],
      contenido: ['', Validators.required],
      actividades: ['', Validators.required],
    });
  }

  formControls(nombre:string) {
    return this.formulario.controls[nombre] as FormControl
  }

  private obtenerMaterias(){
    return this.homeService.suscribirseMaterias()
    .pipe(
      tap(materias =>{
        this.materias$ = of(materias)
        this.materiaSeleccionada = materias[0]
        this.actualizarregistros()
        this.actualizarMateriaFormulario()
      })
    )
  }

  private obtenerTiposClases(){
    return this.libroTemaService.obtenerTiposClases()
    .pipe(
      tap(tipoClases =>{
        this.tiposClases$ = of(tipoClases)
        this.tipoClaseSeleccionada = tipoClases[0]
      })
    )
  }

  private obtenerRegistros(){
    if(this.materiaSeleccionada){
      return this.libroTemaService.obtenerRegistros(this.materiaSeleccionada)
      .pipe(
        tap(registros => {
          this.registros$ = of(registros.sort((a, b) => b.numero_clase - a.numero_clase))
          this.actualizarMateriaFormulario()
        })
      )
    }else{
      return of([])
    }
  }

  actualizarregistros(){
    this.registrosSuscripcion = this.obtenerRegistros().subscribe()
  }

  private actualizarMateriaFormulario(){
    if(this.materiaSeleccionada){
      this.formControls('id_materia').setValue(this.materiaSeleccionada!.id)
      this.formControls('tipo_materia').setValue(this.materiaSeleccionada!.tipo_materia)
      this.formControls('materia').setValue(this.materiaSeleccionada!)
    }
  }


  nuevoRegistro(){
    if(!this.formulario.valid){
      this.formulario.markAllAsTouched();
    }
    else{
      this.libroTemaService.agregarRegistro(this.formulario.value).subscribe({
        complete:()=>{
          this.actualizarregistros()
          this.formulario.reset()
        }
      })
    }
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
