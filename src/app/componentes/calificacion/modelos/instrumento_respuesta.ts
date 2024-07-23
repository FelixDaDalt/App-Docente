export interface instrumento_respuesta {
  id: number
  descripcion: string
  id_materia: number
  materia: string
  tipo_materia: string
  id_escala: number
  alumnos: instrumento_alumno[]

}

export interface instrumento_alumno {
  id: number
  nombre: string
  apellido: string
  curso: string
  id_calificacion:string | string
  observacion?:string | string
  id_conceptual:number
}
