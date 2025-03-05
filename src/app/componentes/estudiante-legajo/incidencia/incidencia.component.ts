import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IncidenciaService } from './incidencia.service';
import { Detalle, IncidenciaForm } from './incidenciaForm';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable, of, Subscription, take, tap } from 'rxjs';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { resultadoBusqueda } from '../../home/home';
import { EstudianteLegajoService } from '../estudiante-legajo.service';
import { comunicado_destinatario, comunicado_destinatario_alumno } from '../../comunicados/comunicado';
import { ComunicadosService } from '../../comunicados/comunicados.service';

@Component({
  selector: 'app-incidencia',
  templateUrl: './incidencia.component.html',
  styleUrls: ['./incidencia.component.css']
})
export class IncidenciaComponent implements OnDestroy{

  destinatarios$:Observable<comunicado_destinatario[]>=of([])
  suscripcionDestinatarios?:Subscription
  grupoSeleccionado!:comunicado_destinatario
  acordeonAbierto = true;
  alumnoSeleccionado:comunicado_destinatario_alumno | null = null

  incidencias: IncidenciaForm[] = [];
  incidenciaSeleccionada?: IncidenciaForm;
  alumno?:resultadoBusqueda
  suscripcion?:Subscription
  archivos: { file: File, preview: string | ArrayBuffer | null }[] = [];

  incidenciaForm$ = this.incidenciaService.incidenciaForm.pipe(tap(respuesta=>{
    if(respuesta.length>0){
      this.incidencias = respuesta;
      if(this.incidenciaSeleccionada){
        this.incidenciaSeleccionada = respuesta.find(inc=>inc.id == this.incidenciaSeleccionada!.id)
      }else{
        this.incidenciaSeleccionada = this.incidencias[0]
      }
      this.generarFormulario(this.incidenciaSeleccionada!.detalle)
    }

  })).subscribe()


  camposForm: FormGroup = this.fb.group({
    dato1:[null],
    dato2:[null],
    dato3:[null],
    dato4:[null],
    dato5:[null],
    dato6:[null],
    dato7:[null],
    dato8:[null],
    arr_adjuntos: [[]],
  });
  private usuarioDatos!:usuarioDatos


  constructor(private fb: FormBuilder,
    private incidenciaService:IncidenciaService,
    private router:Router,
    private activeRoute:ActivatedRoute,
    usuarioDatosService:DatosUsuarioService,
    private legajoService:EstudianteLegajoService,
    private comunicadosService:ComunicadosService){

      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.alumno = navigation.extras.state as resultadoBusqueda;
        this.incidenciaService.obtenerForm(this.alumno.id)
      }else{
        this.suscripcionDestinatarios = this.obtenerDestinatarios().subscribe()
      }

      usuarioDatosService.obtenerDatos().subscribe({
        next:(usuario)=>{
          if(usuario && usuario.Institucion_selected && usuario.Rol_selected){
            this.usuarioDatos = usuario
          }
        }
      })

  }

  obtenerDestinatarios(){
    return this.comunicadosService.obtenerDestinatarios()
     .pipe(
       tap(destinatarios => this.destinatarios$ = of(destinatarios))
     )
   }

   toggleAcordeon() {
    this.acordeonAbierto = !this.acordeonAbierto;
  }


  seleccionEstudiante(alumno:comunicado_destinatario_alumno){
    this.alumnoSeleccionado = alumno
    this.incidenciaService.obtenerForm(this.alumnoSeleccionado.id_alumno)

  }

  ngOnDestroy(): void {
    this.incidenciaForm$.unsubscribe()
  }

  onIncidenciaSeleccionada() {
    if(this.incidenciaSeleccionada)
      this.generarFormulario(this.incidenciaSeleccionada.detalle)
  }

  generarFormulario(detalle: Detalle[]) {
    this.archivos = []
    this.camposForm = this.fb.group({
      dato1:[null],
      dato2:[null],
      dato3:[null],
      dato4:[null],
      dato5:[null],
      dato6:[null],
      dato7:[null],
      dato8:[null],
      arr_adjuntos: [[]],
    });


    // Reinicia el formulario y elimina todos los validadores existentes
     Object.keys(this.camposForm.controls).forEach((controlName) => {
      const control = this.camposForm.get(controlName);
      control?.clearValidators();
      control?.updateValueAndValidity();
    });

    // Aplica los nuevos validadores según el detalle
    detalle.forEach((campo) => {
      const control = this.camposForm.get(campo.name);
      if (control) {
        if (campo.obligatorio && campo.tipo != 'file') {
          control.setValidators([Validators.required]);
        }

        if((campo.obligatorio && campo.tipo == 'file')){

          this.camposForm.get('arr_adjuntos')?.setValidators([Validators.required])
        }

        if (campo.tipo === 'checkbox') {
          // Inicializa el valor como 1 o 0
          control.setValue(control.value ? 1 : 0, { emitEvent: false });

          // Escucha los cambios para transformar true/false a 1/0
          control.valueChanges.subscribe((value) => {
            control.setValue(value ? 1 : 0, { emitEvent: false });
          });
        }
        control.updateValueAndValidity(); // Actualiza el estado del control
      }
    });

  }

  onSubmit() {
    // Definir los campos requeridos con tipos explícitos
    const requiredFields: { [key: string]: any } = {
      id_alumno: this.alumno?this.alumno.id:this.alumnoSeleccionado?this.alumnoSeleccionado.id_alumno:null,
      id_usuario: this.usuarioDatos.Institucion_selected.ID_Usuario_Interno,
      id_nivel: this.usuarioDatos.Rol_selected?.id_nivel,
      rol: this.usuarioDatos.Rol_selected?.rol,
      tipo_incidencia:this.incidenciaSeleccionada?.id || null
    };

    // Agregar los campos requeridos al formulario si no están presentes
    Object.entries(requiredFields).forEach(([key, value]) => {
      if (!this.camposForm.contains(key)) {
        this.camposForm.addControl(key, this.fb.control(value, Validators.required));
      } else if (!this.camposForm.get(key)?.value) {
        this.camposForm.patchValue({ [key]: value });
      }
    });

    if (this.camposForm.valid) {
      this.incidenciaService.enviarInicidencia(this.camposForm.value).subscribe(respuesta=>{
        const alumnoId = this.alumno?this.alumno.id:this.alumnoSeleccionado?this.alumnoSeleccionado.id_alumno:null
        if(alumnoId!=null)
          this.incidenciaService.obtenerForm(alumnoId)
      })
    }
  }

  cancelar(){
    this.router.navigate(['dashboard'])
  }

  onFileChange(event: any): void {
    const arrAdjuntos = this.camposForm.get('arr_adjuntos');
    const files = event.target.files;

    if (files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Verificar si el archivo ya existe en la lista this.archivos
            if (!this.archivos.some(archivo => archivo.file.name === file.name)) {
                const reader = new FileReader();

                reader.onload = () => {
                    // Almacenar el archivo junto con la vista previa generada
                    this.archivos.push({ file, preview: reader.result });

                    // Actualizar el formControl con el nuevo archivo
                    arrAdjuntos?.patchValue([...arrAdjuntos.value, file]);
                };

                // Leer el archivo y generar la vista previa
                reader.readAsDataURL(file);
            } else {
                // Aquí puedes mostrar un mensaje de error o realizar alguna acción
                console.log(`El archivo ${file.name} ya existe.`);
            }
        }
    }
  }

  eliminarArchivo(index: number) {
    const arrAdjuntos = this.camposForm.get('arr_adjuntos');

    // Eliminar el archivo del array de archivos
    this.archivos.splice(index, 1);

    // Eliminar el archivo correspondiente del formControl
    const archivosActuales = arrAdjuntos?.value;
    archivosActuales.splice(index, 1);
    arrAdjuntos?.patchValue(archivosActuales);
  }

  formControls(nombre:string) {
    return this.camposForm.controls[nombre] as FormControl
  }
}
