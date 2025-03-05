
export interface difusion {
  id: number
  id_usuario: number
  codigo_estado: string
  estado: string
  id_curso: number
  titulo: string
  imagenes: number
  descripcion: string
  fecha: string
  total_destinatarios: number
  total_leidos: number
  coeficiente_lectura: number
  vigencia: string
  editable:number
  borrable:number
}

export interface difusion_detalle {
  id?: number
  id_curso?:number
  estado: string
  titulo: string
  descripcion: string
  vigencia: string
  desde: string
  hasta: string
  total_destinatarios: number
  total_leidos: number
  coeficiente_lectura: number
  imagenes: Archivo[]
  destinatarios: Destinatario[]
  editable:number
  borrable:number
  codigo_estado: string
}

export interface Archivo {
  id_imagen: number
  nombre_imagen: string
  url: string
}

export interface Destinatario {
  destinatario: string
  mail_destinatario: string
  enviado: number
  leido: number
  fecha_leido: string
  hora_leido: string
}
