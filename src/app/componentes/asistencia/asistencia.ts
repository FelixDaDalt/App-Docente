export interface Asistencia {
  id: number
  materia: string
  tipo: string
  alumnos: Alumno[]
  curso?:string
  total_ausentes:number
  total_presentes:number
  total_tardes:number
  total_retirados:number


  fecha_base?: string,
  id_parte: number,
  fecha_parte:string,
  hora_parte:string,
  editable?: number,
  mensaje?:string
}

export interface Alumno {
  id: number
  nombre: string
  apellido: string
  curso: string
  justificacion: number
  detalle_justificacion: string
  estado_asistencia:string
  estado_comedor?:boolean

  comedor?:boolean
  estado:string|"" //local
  observacion:string|"" //local
}


export class Parte_Asistencia{
  id_materia:number
  tipo_materia:string
  fecha:string
  id_parte:number
  arr_alumnos: Parte_Alumno[]
  id_agrupacion:number


  constructor(id_materia:number,tipo_materia:string,fecha:string,id_parte:number,arr_alumnos?: Parte_Alumno[],id_agrupacion?:number){
      this.id_materia = id_materia
      this.tipo_materia= tipo_materia
      this.fecha = fecha
      this.arr_alumnos = arr_alumnos || []
      this.id_agrupacion = 0
      this.id_parte = id_parte
    }

    toJSON() {
      return {
        id_materia: this.id_materia,
        tipo_materia: this.tipo_materia,
        fecha: this.fecha,
        id_parte: this.id_parte,
        id_agrupacion: this.id_agrupacion,
        arr_alumnos: this.arr_alumnos.map(alumno => alumno.toJSON())

      };
    }

}

export class Parte_Alumno{
  id_alumno:number
  estado:string
  observacion?:string
  comedor?:number

  constructor(id_alumno:number,estado:string,observacion?:string,comedor?:boolean){
    this.id_alumno = id_alumno
    this.estado = estado
    this.observacion = observacion || ""
    this.comedor = comedor?1:0
  }

  toJSON() {
    return {
      id_alumno: this.id_alumno,
      estado: this.estado,
      observacion: this.observacion,
      comedor:this.comedor
    };
  }

}

export interface parte{
  id: number
  fecha: string
  materia: string
  datos_generacion: string
  total_presentes: number
  total_ausentes: number
  total_tardes: number
  total_retiros: number

}
