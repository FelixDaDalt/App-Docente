import { DifusionService } from './../difusiones.service';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription, tap, shareReplay, map } from 'rxjs';
import { comunicado_destinatario, comunicado_destinatario_alumno } from 'src/app/componentes/comunicados/comunicado';
import { ComunicadosService } from 'src/app/componentes/comunicados/comunicados.service';

@Component({
  selector: 'app-nueva-difusion',
  templateUrl: './nueva-difusion.component.html',
  styleUrls: ['./nueva-difusion.component.css']
})
export class NuevaDifusionComponent {

  archivos: { file: File, preview: string | ArrayBuffer | null }[] = [];
  grupoDestinatarios: comunicado_destinatario_alumno[] = [];
  formulario: FormGroup
  private suscription?:Subscription
  private destinatariosSuscripcion?:Subscription

  private difusionService = inject(DifusionService);
  private fb= inject(FormBuilder)
  private route = inject(ActivatedRoute)
  private router = inject(Router)



  constructor(){
    this.difusionService.obtenerDestinatarios()
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      arr_destinatarios: [[], Validators.required],
      arr_adjuntos: [[],Validators.required],
      id_curso: [0],
      fecha_desde: ['', Validators.required],
      fecha_hasta: ['', Validators.required],
    })
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe()
    this.destinatariosSuscripcion?.unsubscribe()
  }

  ngOnInit(): void {
    this.destinatariosSuscripcion?.unsubscribe()
     this.destinatariosSuscripcion = this.difusionService.destinatarios$.pipe(
      map(data => this.transformarData(data))
    ).subscribe(destinatarios => {
      this.grupoDestinatarios = destinatarios;
    });
  }

  private transformarData(data: comunicado_destinatario[]): comunicado_destinatario_alumno[] {
    let destinatarios: comunicado_destinatario_alumno[] = [];
    data.forEach(grupo => {
      const grupoDestinatarios = grupo.destinatarios.map(destinatario => ({
        ...destinatario,
        nombre_grupo: grupo.nombre_grupo
      }));
      destinatarios = destinatarios.concat(grupoDestinatarios);
    });
    return destinatarios;
  }

  seleccion(selecciones: comunicado_destinatario_alumno[]): void {
    const destinatarios = selecciones.map(item => ({
      id_destinatario: item.id_alumno,
      tipo_destinatario: 1
    }));
    this.formulario.get('arr_destinatarios')?.setValue(destinatarios);
  }

  formControls(nombre:string) {
    return this.formulario.controls[nombre] as FormControl
  }

  enviar(){
    if(!this.formulario.valid){
      this.formulario.markAllAsTouched()
    }else{
      this.suscription?.unsubscribe()
      this.suscription = this.difusionService.enviarDifusion(this.formulario.value).subscribe({
        next:()=>{

          this.router.navigate(['../'],{relativeTo:this.route})
        }
      })
    }

  }

  cancelar(){
    this.router.navigate(['../'],{relativeTo:this.route})
  }

  onFileChange(event: any): void {
    const arrAdjuntos = this.formControls('arr_adjuntos');
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
                    arrAdjuntos.patchValue([...arrAdjuntos.value, file]);
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

esImagen(file: File): boolean {
  return file.type.startsWith('image/');
}

esVideo(file: File): boolean {
  return file.type.startsWith('video/');
}

eliminarArchivo(index: number) {
  const arrAdjuntos = this.formControls('arr_adjuntos');

  // Eliminar el archivo del array de archivos
  this.archivos.splice(index, 1);

  // Eliminar el archivo correspondiente del formControl
  const archivosActuales = arrAdjuntos.value;
  archivosActuales.splice(index, 1);
  arrAdjuntos.patchValue(archivosActuales);
}
}
