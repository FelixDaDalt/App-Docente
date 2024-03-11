import { resultadoBusqueda } from "../home/home"


export class legajoAlumno{
  alumno?:resultadoBusqueda
  inasistencia?:inasistencia
  legajo?:legajo
  academico?:academico[]
}

export interface academico {
  id_materia: number
  materia: string
  tipo_materia: string
  docente: string
  calificaciones: Calificacion[]
}

export interface Calificacion {
  fecha: string
  tipo: string
  descripcion: string
  calificacion: string
}

export interface inasistencia {
  tarde: falta[]
  ausente: falta[]
  ausente_justificado: falta[]
  ausente_RI: falta[]
  total_faltas: number
  todas_juntas:falta[]
}

export interface falta {
  id_estado: number
  estado: string
  fecha: string
  id_parte:number
  detalle:string
}



export interface legajo {
  Faltas_Leves: legajoFalta[]
  cantidad_leves: number
  Faltas_Graves: legajoFalta[]
  cantidad_graves: number
  Sanciones: sancion[]
  cantidad_sanciones: number
  Uniforme: uniforme[]
  cantidad_uniforme: number
  Familiares: familiar[]
  cantidad_familiares: number
  Documentos: Documento[]
  cantidad_documentos: number
  Entrevistas: Entrevista[]
  cantidad_entrevistas: number
  Observaciones: Observacion[]
  cantidad_observaciones: number
  Derivaciones: derivacion[]
  cantidad_derivaciones: number
  Avisos: Aviso[]
  Avisos_d: Aviso[]
  cantidad_avisos: number
  cantidad_avisos_d:number
}

export interface Documento {
  tipo_categoria:string
  fecha: string
  registro: string
  titulo: string
  descripcion: string
  archivo: string
}

export interface Entrevista {
  tipo_categoria:string
  id: number
  fecha: string
  hora: string
  registro: string
  motivo: string
  comentarios: string
  objetivos: string
  presentes: string
  tipo: string
  autor: number
}

export interface Observacion {
  tipo_categoria:string
  id: number
  fecha: string
  hora: string
  registro: number
  descripcion: string
}

export interface Aviso {
  tipo_categoria:string
  id: number
  registro: string
  fecha: string
  desde: string
  hasta: string
  motivo: string
}

export interface legajoFalta{
  tipo_categoria:string
  id: number,
  registro:string,
  fecha:string,
  tipo:string,
  clase:string,
  descripcion:string,
}

export interface sancion{
    tipo_categoria:string
    fecha: string
    registro: string
    tipo: string
    cantidad: number
    libro: string
  }

  export interface uniforme {
    tipo_categoria:string
    fecha: string
    hora: string
    registro: string
    pantalon: number
    swetter: number
    chomba: number
    barba: number
    penalizado: string
    descripcion: string
}

export interface derivacion {
  tipo_categoria:string
  id: number
  fecha: string
  hora: string
  registro: string
  descripcion: string
}

export interface familiar {
  tipo_categoria:string
  fecha: string
  hora: string
  registro: string
  id_tipo: number
  descripcion: string
}



