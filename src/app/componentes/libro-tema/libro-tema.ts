import { materias } from "../home/home"

export interface libroTema{
  fecha: string
  numero_clase: number
  tipo_clase: string
  contenidos: string
  actividades: string
  ausentes: AlumnoAusente[]
}

export interface AlumnoAusente {
  id: number
  nombre: string
  apellido: string
}

export interface tipoClase{
  id:number,
  tipo: string
}

export class nuevo_registro{
  id_materia:number
  tipo_materia:string
  fecha:string
  tipo_clase:string
  contenido:string
  actividades:string
  materia?:materias

  constructor(id_materia:number,tipo_materia:string,fecha:string,tipo_clase:string,contenido?:string,actividades?:string){
    this.id_materia=id_materia
    this.tipo_materia=tipo_materia
    this.fecha=fecha
    this.tipo_clase = tipo_clase
    this.contenido = contenido || ""
    this.actividades = actividades || ""
  }

}
