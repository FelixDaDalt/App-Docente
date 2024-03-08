export interface reunion{
    id: number
    fecha: string
    alumno: string
    titulo: string
    descripcion: string
    propuesta_reunion: string
    leido: number
    datos_lectura: any
    respuesta: number
    respuesta_remitente: string
    leido_respuesta: number
    respuesta_texto: string
    respuesta_fundamento: string
    respuesta_date: string
    reprogramacion: number
    borrable: number
}

export class nueva_Reunion{
  id_usuario?: string
  titulo: string
  descripcion: string
  fecha: string
  hora: string
  id_destinatario: number
  rol?: string
  id_nivel?: string

  constructor(titulo:string, descripcion:string,fecha:string,hora:string,id_destinatario:number){
    this.titulo = titulo
    this.descripcion = descripcion
    this.fecha = fecha
    this.hora = hora
    this.id_destinatario = id_destinatario
  }
}

