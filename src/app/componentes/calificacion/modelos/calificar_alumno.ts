export interface CalificarAlumno {
  id_usuario?:number
  tipo_materia: string;
  id_materia: number;
  id_alumno: number;
  id_calificacion: number | string | null ;
  id_operacion: number;
  observacion: string;
  alumno: string;
  nuevaNota?:number | string |null
  nuevaObservacion?:string
  id_conceptual?:number

}
