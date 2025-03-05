import { DifusionService } from '../difusiones.service';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription, tap, shareReplay } from 'rxjs';
import { comunicado_destinatario, comunicado_destinatario_alumno } from 'src/app/componentes/comunicados/comunicado';
import { ComunicadosService } from 'src/app/componentes/comunicados/comunicados.service';
import { Archivo, difusion_detalle } from '../difusion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComunicadosEnviadosDestinatariosComponent } from '../../comunicados/comunicados-enviados/comunicados-enviados-destinatarios/comunicados-enviados-destinatarios.component';

@Component({
  selector: 'app-editar-difusion',
  templateUrl: './editar-difusion.component.html',
  styleUrls: ['./editar-difusion.component.css']
})
export class EditarDifusionComponent {

  difusion?: difusion_detalle;
  suscripcionDetalle?: Subscription;

  archivos: { file: File; preview: string | ArrayBuffer | null }[] = [];
  formulario: FormGroup;
  private suscription?: Subscription;

  private difusionService = inject(DifusionService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private modal = inject(NgbModal);
  isExpanded = false;

  constructor() {
    this.formulario = this.fb.group({
      id_publicacion: [],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      arr_destinatarios: [[]],
      arr_adjuntos: [[],Validators.required],
      fecha_desde: ['', Validators.required],
      fecha_hasta: ['', Validators.required],
      id_curso: [0],
    });
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
    this.suscripcionDetalle?.unsubscribe();
  }

  ngOnInit(): void {
    this.suscripcionDetalle = this.difusionService.difusionEditar$.subscribe(
      (difusionDetalle) => {
        if (difusionDetalle) {

          this.difusion = difusionDetalle;
          this.formulario.setValue({
            id_publicacion: difusionDetalle.id,
            titulo: difusionDetalle.titulo,
            descripcion: difusionDetalle.descripcion,
            fecha_desde: difusionDetalle.desde,
            fecha_hasta: difusionDetalle.hasta,
            arr_adjuntos: [],
            arr_destinatarios: difusionDetalle.destinatarios,
            id_curso: difusionDetalle.id_curso,
          });
        }
      }
    );
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  seleccion(selecciones: comunicado_destinatario_alumno[]): void {
    const destinatarios = selecciones.map((item) => ({
      id_destinatario: item.id_alumno,
      tipo_destinatario: 1,
    }));
    this.formulario.get('arr_destinatarios')?.setValue(destinatarios);
  }

  formControls(nombre: string) {
    return this.formulario.controls[nombre] as FormControl;
  }

  enviar() {
    if(!this.formulario.valid){
      this.formulario.markAllAsTouched()
    }else{
      this.difusionService.editarDifusion(this.formulario.value).subscribe({
        next:()=>{
          this.difusionService.actualizar()
          this.router.navigate(['../'],{relativeTo:this.route})
        },
        error:(e)=>{
          console.log(e)
        }
      })
    }

  }

  cancelar() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onFileChange(event: any): void {
    const arrAdjuntos = this.formControls('arr_adjuntos');
    const files = event.target.files;

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Verificar si el archivo ya existe en la lista this.archivos
        if (!this.archivos.some((archivo) => archivo.file.name === file.name)) {
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

  quitarArchivo(index: number) {
    const arrAdjuntos = this.formControls('arr_adjuntos');

    // Eliminar el archivo del array de archivos
    this.archivos.splice(index, 1);

    // Eliminar el archivo correspondiente del formControl
    const archivosActuales = arrAdjuntos.value;
    archivosActuales.splice(index, 1);
    arrAdjuntos.patchValue(archivosActuales);
  }



  eliminarArchivo(archivo: Archivo){
    this.difusionService.eliminarAchivo(archivo.id_imagen).subscribe({
      next: () => {

        if (this.difusion && this.difusion.imagenes) {
          this.difusion.imagenes = this.difusion.imagenes.filter(
            (imagen) => imagen.id_imagen !== archivo.id_imagen
          );
        }
      },
    });
  }

  esImagenApi(url: string): boolean {
    const extension = this.obtenerExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(
      extension.toLowerCase()
    );
  }

  esVideoAPI(url: string): boolean {
    const extension = this.obtenerExtension(url);
    return ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(
      extension.toLowerCase()
    );
  }

  private obtenerExtension(url: string): string {
    return url.split('.').pop() || '';
  }

  verDestinatarios(){
      const modalRef = this.modal.open(ComunicadosEnviadosDestinatariosComponent,{
        size: 'lg'
      });
      modalRef.componentInstance.destinatarios = this.difusion?.destinatarios
  }
}
