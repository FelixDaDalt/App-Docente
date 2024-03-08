import { comunicado_nuevo } from './../comunicado';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicadosService } from '../comunicados.service';
import { comunicado_destinatario, comunicado_destinatario_alumno } from '../comunicado';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-nuevo-comunicado',
  templateUrl: './nuevo-comunicado.component.html',
  styleUrls: ['./nuevo-comunicado.component.css']
})
export class NuevoComunicadoComponent implements OnInit,OnDestroy{

  listaComunicadoDestinatarios:comunicado_destinatario[]=[]
  grupoSeleccionado!:comunicado_destinatario

  destinatariosSeleccionados:comunicado_destinatario[]=[]
  archivos: File[] = [];

  acordeonAbierto = true;

  private ngUnsuscribe=new Subject()

  constructor(private comunicadosService:ComunicadosService,
    private route:Router){

  }

  ngOnInit(): void {
    this.obtenerDestinatarios()
  }

  ngOnDestroy(): void {
    this.ngUnsuscribe.next(null)
    this.ngUnsuscribe.complete()
  }

  obtenerDestinatarios(){
    this.comunicadosService.obtenerDestinatarios()
    .pipe(takeUntil(this.ngUnsuscribe))
    .subscribe({
      next:(respuesta)=>{
        this.listaComunicadoDestinatarios = respuesta
      }
    })
  }

  seleccionarAlumno(alumno: comunicado_destinatario_alumno) {
    // Verificar si el grupo seleccionado ya está en DestinatariosSeleccionados
    const grupoEnDestinatarios = this.destinatariosSeleccionados.find(
      (grupo) => grupo.nombre_grupo === this.grupoSeleccionado.nombre_grupo
    );

    // Si el grupo no está en DestinatariosSeleccionados, agrégalo
    if (!grupoEnDestinatarios) {
      const nuevoGrupo = { ...this.grupoSeleccionado};
      nuevoGrupo.destinatarios = []
      this.destinatariosSeleccionados.push(nuevoGrupo);
    }

    // Verificar si el alumno ya está en DestinatariosSeleccionados
    const alumnoEnDestinatarios = this.destinatariosSeleccionados
      .map((grupo) => grupo.destinatarios)
      .flat()
      .find((al) => al === alumno);

    // Si el alumno no está en DestinatariosSeleccionados, agrégalo
    if (!alumnoEnDestinatarios) {
      this.destinatariosSeleccionados.forEach((grupo) => {
        if (grupo.nombre_grupo === this.grupoSeleccionado.nombre_grupo) {
          grupo.destinatarios.push(alumno);
          let i = this.grupoSeleccionado.destinatarios.findIndex(dest=>dest === alumno)
          if(i!==undefined && i!==-1)
            this.grupoSeleccionado.destinatarios.splice(i,1)
        }
      });
    }
  }

  eliminarAlumno(destinatario: comunicado_destinatario, alumno: comunicado_destinatario_alumno) {
    // Buscar el grupo correspondiente en this.listaComunicadoDestinatarios
    const grupoEnLista = this.listaComunicadoDestinatarios.find((grupo) => grupo.nombre_grupo === destinatario.nombre_grupo);

    // Si el grupo existe en this.listaComunicadoDestinatarios, agregar el alumno
    if (grupoEnLista) {
      grupoEnLista.destinatarios.push(alumno);
    }

    // Buscar el grupo correspondiente en this.destinatariosSeleccionados
    const indexDestinatario = this.destinatariosSeleccionados.findIndex((grupo) => grupo.nombre_grupo === destinatario.nombre_grupo);

    // Si el grupo existe en this.destinatariosSeleccionados, eliminar el alumno
    if (indexDestinatario !== undefined && indexDestinatario !== -1) {
      const indexAlumno = this.destinatariosSeleccionados[indexDestinatario].destinatarios.findIndex((a) => a === alumno);

      // Si el alumno existe en el grupo, eliminarlo
      if (indexAlumno !== undefined && indexAlumno !== -1) {
        this.destinatariosSeleccionados[indexDestinatario].destinatarios.splice(indexAlumno, 1);
        if(this.destinatariosSeleccionados[indexDestinatario].destinatarios.length === 0)
          this.destinatariosSeleccionados.splice(indexDestinatario, 1);
      }
    }
  }


  seleccionarTodo() {
    // Verificar si el grupo seleccionado ya está en DestinatariosSeleccionados
    const grupoEnDestinatarios = this.destinatariosSeleccionados.find(
      (grupo) => grupo.nombre_grupo === this.grupoSeleccionado.nombre_grupo
    );

    // Si el grupo no está en DestinatariosSeleccionados, agrégalo
    if (!grupoEnDestinatarios) {
      const nuevoGrupo = { ...this.grupoSeleccionado };
      nuevoGrupo.destinatarios = [...this.grupoSeleccionado.destinatarios]; // Clonar la lista de destinatarios
      this.destinatariosSeleccionados.push(nuevoGrupo);
    }

    // Obtener la lista de alumnos seleccionados en el grupo actual
    const alumnosSeleccionados = this.grupoSeleccionado.destinatarios;

    // Verificar si los alumnos ya existen en el grupo actual
    const grupoActual = this.destinatariosSeleccionados.find((grupo) => grupo.nombre_grupo === this.grupoSeleccionado.nombre_grupo);

    if (grupoActual) {
      alumnosSeleccionados.forEach((alumno) => {
        // Verificar si el alumno ya está en el grupo
        if (!grupoActual.destinatarios.includes(alumno)) {
          grupoActual.destinatarios.push(alumno);
        }
      });

      // Limpiar la lista de alumnos seleccionados en el grupo actual
      this.grupoSeleccionado.destinatarios.length = 0;
    }
  }


  toggleRow(destinatario: any): void {
    destinatario.expanded = !destinatario.expanded;
  }

  toggleAcordeon() {
    this.acordeonAbierto = !this.acordeonAbierto;
  }

  onFileChange(event: any): void {
    this.archivos = [];
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.archivos.push(files[i]);
      }
    }
  }

  enviar(titulo: string, mensaje: string) {
    const hayDestinatarios = this.destinatariosSeleccionados.some(grupo => grupo.destinatarios.length > 0);
    const tituloNoVacio = titulo.trim() !== '';
    const mensajeNoVacio = mensaje.trim() !== '';

    if (hayDestinatarios && tituloNoVacio && mensajeNoVacio) {
      const nuevoComunicado = {
        titulo:titulo,
        descripcion: mensaje,
        arr_destinatarios: this.destinatariosSeleccionados
          .flatMap(grupo => grupo.destinatarios)
          .map(alumnoEnDestinatario => ({
            id_destinatario: alumnoEnDestinatario.id_alumno,
            tipo_destinatario: 1
          })),
        arr_adjuntos: [],
        id_curso:0,
        id_materia:0,
        id_nivel:0,
        id_usuario:0,
        rol:0
      };

      this.comunicadosService.enviarComunicado(nuevoComunicado)
        .pipe(takeUntil(this.ngUnsuscribe))
        .subscribe({
          next: (respuesta) => {
            this.route.navigate(['/comunicados-enviados']);
          },
          error: (error) => {
            console.error('Error al enviar el comunicado', error);
          }
        });

    } else {
      console.log("No hay seleccionados o título/mensaje vacíos");
    }
  }


}
