import { Component, OnInit } from '@angular/core';
import { comunicado_destinatario, comunicado_destinatario_alumno } from '../../../dashboard/comunicados/comunicado';
import { Observable, Subject, Subscription, map, of, takeUntil, tap } from 'rxjs';
import { ComunicadosService } from '../../../dashboard/comunicados/comunicados.service';
import { Router } from '@angular/router';
import { nueva_Reunion } from '../reunion';
import { ReunionesService } from '../reuniones.service';
import { NotificacionService } from 'src/app/otros/notificacion-popup/notificacionpopup.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-nueva-reunion',
  templateUrl: './nueva-reunion.component.html',
  styleUrls: ['./nueva-reunion.component.css']
})
export class NuevaReunionComponent implements OnInit{

  destinatarios$:Observable<comunicado_destinatario[]>=of([])
  suscripcionDestinatarios?:Subscription
  suscripcionTextoPredeterminado?:Subscription

  grupoSeleccionado!:comunicado_destinatario
  acordeonAbierto = true;

  formulario!: FormGroup;

  constructor(private comunicadosService:ComunicadosService,
    private reunionesService:ReunionesService,
    private fb: FormBuilder,
    private route:Router){

  }

  ngOnInit(): void {
    this.formGroup()
    this.suscripcionDestinatarios = this.obtenerDestinatarios().subscribe()
    this.suscripcionTextoPredeterminado = this.obtenerTextoPrederminado().subscribe()
  }

  ngOnDestroy(): void {
   this.suscripcionDestinatarios?.unsubscribe()
   this.suscripcionTextoPredeterminado?.unsubscribe()
  }

  private formGroup(){
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      id_destinatario: ['', Validators.required],
    });
  }

  formControls(nombre:string) {
    return this.formulario.controls[nombre] as FormControl
  }

  private obtenerTextoPrederminado(){
    return this.reunionesService.getTextoPredeterminado().
    pipe(
      tap(texto => this.decodificarHTML(texto)
      )
    )
  }

  obtenerDestinatarios(){
   return this.comunicadosService.obtenerDestinatarios()
    .pipe(
      tap(destinatarios => this.destinatarios$ = of(destinatarios))
    )
  }


  decodificarHTML(textoCodificado: string) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = textoCodificado;
    this.formControls('descripcion').setValue(textarea.value)
  }


  toggleAcordeon() {
    this.acordeonAbierto = !this.acordeonAbierto;
  }

  enviar() {
    if(!this.formulario.valid){
      this.formulario.markAllAsTouched()
    }else{
     const suscripcionEnvio = this.reunionesService.enviarReunion(this.formulario.value)
        .subscribe({
          next: () => {
            this.route.navigate(['dashboard','reuniones']);
          },
          complete:()=>{
            suscripcionEnvio.unsubscribe()
          }
        });
    }
  }

  capturarTexto(event:any): void {
    const textoEditado = event.target.innerHTML;
    this.formControls('descripcion').setValue(textoEditado)
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

  private alumnoSeleccionado:comunicado_destinatario_alumno | null = null
  seleccionEstudiante(alumno:comunicado_destinatario_alumno){
    let mensaje:string=""
    const texto = this.formControls('descripcion').value
    if(this.alumnoSeleccionado==null)
    {
      const regex = /ZZZ/g;
      mensaje = texto?.replace(regex,alumno.alumno);
    }else{
      const regex = new RegExp(`\\b${this.alumnoSeleccionado.alumno}\\b`, 'g');
      mensaje = texto?.replace(regex,alumno.alumno);
    }
    this.alumnoSeleccionado = alumno
    this.formControls('descripcion').setValue(mensaje)
    this.formControls('id_destinatario').setValue(alumno.id_alumno)
  }
}
