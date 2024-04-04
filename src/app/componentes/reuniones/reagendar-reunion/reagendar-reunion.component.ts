import { ReunionesService } from '../reuniones.service';
import { reunion } from './../reunion';
import { Component, Input, OnInit } from '@angular/core';
import { NotificacionService } from 'src/app/otros/notificacion-popup/notificacionpopup.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { comunicado_destinatario_alumno } from 'src/app/dashboard/comunicados/comunicado';

export interface reprogramar{
  id_usuario?:number
  titulo: string
  descripcion: string
  fecha: string
  hora: string
  id_solicitud: number
}

@Component({
  selector: 'app-reagendar-reunion',
  templateUrl: './reagendar-reunion.component.html',
  styleUrls: ['./reagendar-reunion.component.css']
})
export class ReagendarReunionComponent implements OnInit{
  @Input() reunion!:reunion
  mensaje?:string
  formulario!: FormGroup;


  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private reunionService:ReunionesService){ }


  ngOnInit(): void {
    this.formGroup()
    this.decodificarHTML(this.reunion!.descripcion)
  }

  private formGroup(){
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      id_solicitud: [this.reunion.id, Validators.required],
    });
  }

  formControls(nombre:string) {
    return this.formulario.controls[nombre] as FormControl
  }


  capturarTexto(event:any): void {
    const textoEditado = event.target.innerHTML;
    this.formControls('descripcion').setValue(textoEditado)
  }

  private decodificarHTML(textoCodificado: string) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = textoCodificado;
    this.formControls('descripcion').setValue(textarea.value)
  }

  reprogramar() {
    if(!this.formulario.valid){
      this.formulario.markAllAsTouched()
    }
    else
    {
      const suscripcionEnvio = this.reunionService.reprogramar(this.formulario.value)
        .subscribe({
          next: () => {
            this.activeModal.close()
          },
          complete:()=>{
            suscripcionEnvio.unsubscribe()
          }
        });
    }
  }

  private horaSeleccionada:string | null = null
  seleccionHora(hora:string){
    let mensaje:string=""
    const texto = this.formControls('descripcion').value
    if(this.horaSeleccionada==null){
      const regex = /HH:MM/g; // Expresión regular para buscar 'HH:MM'
      mensaje = texto?.replace(regex,hora);
    }else{
      const regex = new RegExp(`\\b${this.horaSeleccionada}\\b`, 'g');
      mensaje = texto?.replace(regex,hora);
    }
    this.horaSeleccionada = hora
    this.formControls('descripcion').setValue(mensaje)
  }


  private fechaSeleccionada:string|null = null
  seleccionFecha(fecha:string){
    let mensaje:string=""
    const texto = this.formControls('descripcion').value
    if(this.fechaSeleccionada==null){
      const regex = /DD\/MM\/AAAA/g; // Expresión regular para buscar 'HH:MM'
      mensaje = texto?.replace(regex,fecha);
    }else{
      const regex = new RegExp(`\\b${this.fechaSeleccionada}\\b`, 'g');
      mensaje = texto?.replace(regex,fecha);
    }
    this.fechaSeleccionada = fecha
    this.formControls('descripcion').setValue(mensaje)
  }
}


