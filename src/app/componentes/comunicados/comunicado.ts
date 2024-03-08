export interface comunicado{
    id: number
    fecha: string
    titulo: string
    descripcion: string
    adjunto_url: string
    leido:number
}

export interface comunicado_destinatario{
  nombre_grupo: string
  id_materia: number
  id_curso: number
  destinatarios: comunicado_destinatario_alumno[]
  expanded: false
}


export interface comunicado_destinatario_alumno {
  alumno: string
  id_alumno: number
}

export class comunicado_nuevo {
  id_usuario?: number;
  titulo: string;
  descripcion: string;
  arr_adjuntos: { arch_adjuntos: File }[];
  arr_destinatarios?: { id_destinatario: number, tipo_destinatario: number }[];
  id_curso?: number;
  id_materia?: number;
  rol?: string;
  id_nivel?: number;

  constructor(titulo: string, descripcion: string,
    arr_destinatarios: { id_destinatario: number, tipo_destinatario: number }[],
    arr_adjuntos: File[])
  {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.arr_destinatarios = arr_destinatarios;
    this.arr_adjuntos = arr_adjuntos.map(file => ({ arch_adjuntos: file }));
  }
}

