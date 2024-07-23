import { comunicado_nuevo } from '../comunicado';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComunicadosService } from '../comunicados.service';
import { comunicado_destinatario, comunicado_destinatario_alumno } from '../comunicado';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, of, shareReplay, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo-comunicado',
  templateUrl: './nuevo-comunicado.component.html',
  styleUrls: ['./nuevo-comunicado.component.css']
})
export class NuevoComunicadoComponent implements OnInit,OnDestroy{

  destinatarios$:Observable<comunicado_destinatario[]>=of([])
  listaComunicadoDestinatarios:comunicado_destinatario[] = []
  destinatariosSuscripcion?:Subscription

  grupoSeleccionado!:comunicado_destinatario

  destinatariosSeleccionados:comunicado_destinatario[]=[]
  archivos: File[] = [];

  acordeonAbierto = true;

  formulario!: FormGroup;

  constructor(private comunicadosService:ComunicadosService,
    private route:Router,
    private fb: FormBuilder){

  }

  ngOnInit(): void {
    this.formGroup()
    this.destinatariosSuscripcion = this.obtenerDestinatarios().subscribe()
  }

  ngOnDestroy(): void {
    this.destinatariosSuscripcion?.unsubscribe()
  }

  private formGroup(){
    this.formulario = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      arr_destinatarios: [[], Validators.required],
      arr_adjuntos: [[]],
      id_curso: [0],
      id_materia: [0],
      id_nivel: [0],
      id_usuario: [0],
      rol: [0],
    });
  }

  formControls(nombre:string) {
    return this.formulario.controls[nombre] as FormControl
  }

  obtenerDestinatarios(){
    return this.comunicadosService.obtenerDestinatarios().pipe(
      tap(destinatarios => {
        this.destinatarios$ = of(destinatarios)
        this.listaComunicadoDestinatarios = destinatarios
      }),
      shareReplay(1)
    )
  }

  seleccionarAlumno(alumno: comunicado_destinatario_alumno) {
    const arrDestinatariosControl = this.formControls('arr_destinatarios');
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
          arrDestinatariosControl.patchValue([...arrDestinatariosControl.value, {id_destinatario:alumno.id_alumno,tipo_destinatario: 1}]);
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
      const arrDestinatariosControl = this.formControls('arr_destinatarios');
      const arrDestinatariosValue = arrDestinatariosControl.value;
      const indexToRemove = arrDestinatariosValue.findIndex((destinatario: any) => destinatario.id_destinatario === alumno.id_alumno);
      if (indexToRemove !== -1) {
        arrDestinatariosValue.splice(indexToRemove, 1);
        arrDestinatariosControl.patchValue([...arrDestinatariosValue]);
      }
    }
  }


  seleccionarTodo() {
    const grupoSeleccionado = this.grupoSeleccionado;
    const destinatariosSeleccionados = this.destinatariosSeleccionados;

    const grupoEnDestinatarios = destinatariosSeleccionados.find(
      (grupo) => grupo.nombre_grupo === grupoSeleccionado.nombre_grupo
    );

    if (!grupoEnDestinatarios) {
      const nuevoGrupo = Object.assign({}, grupoSeleccionado);
      nuevoGrupo.destinatarios = [...grupoSeleccionado.destinatarios];
      destinatariosSeleccionados.push(nuevoGrupo);

      const arrDestinatariosControl = this.formControls('arr_destinatarios');
      const nuevosDestinatarios = nuevoGrupo.destinatarios.filter((nuevoDestinatario) => {
        return !arrDestinatariosControl.value.some((destinatarioExistente:any) => destinatarioExistente.id_alumno === nuevoDestinatario.id_alumno);
      });

      const nuevosDestinatariosFormateados = nuevosDestinatarios.map((alumno) => {
        return { id_destinatario: alumno.id_alumno, tipo_destinatario: 1 };
      });

      arrDestinatariosControl.patchValue([...arrDestinatariosControl.value, ...nuevosDestinatariosFormateados]);
    }

    const alumnosSeleccionados = grupoSeleccionado.destinatarios;

    const grupoActual = destinatariosSeleccionados.find((grupo) => grupo.nombre_grupo === grupoSeleccionado.nombre_grupo);

    if (grupoActual) {
      alumnosSeleccionados.forEach((alumno) => {
        if (!grupoActual.destinatarios.includes(alumno)) {
          grupoActual.destinatarios.push(alumno);
        }
      });

      grupoSeleccionado.destinatarios.length = 0;
    }
}

  enviar() {
   console.log(this.formulario.value)
  }

  toggleRow(destinatario: any): void {
    destinatario.expanded = !destinatario.expanded;
  }

  toggleAcordeon() {
    this.acordeonAbierto = !this.acordeonAbierto;
  }

  onFileChange(event: any): void {
    const arrAdjuntos = this.formControls('arr_adjuntos');
    const files = event.target.files;
    if (files) {
        for (let i = 0; i < files.length; i++) {
            // Verificar si el archivo ya existe en la lista this.archivos
            if (!this.archivos.some(archivo => archivo.name === files[i].name)) {
                this.archivos.push(files[i]);


                arrAdjuntos.patchValue([...arrAdjuntos.value,files[i]])
            } else {
                // Aquí puedes mostrar un mensaje de error o realizar alguna acción
                console.log(`El archivo ${files[i].name} ya existe.`);
            }
        }
    }
}



  eliminarArchivo(index: number): void {
    if (index > -1) {
        this.archivos.splice(index, 1);
        const arrAdjuntos = this.formControls('arr_adjuntos');
        const arrAdjuntosValue = arrAdjuntos.value;
        arrAdjuntosValue.splice(index, 1);
        arrAdjuntos.patchValue([...arrAdjuntosValue]);

    }
}



}
