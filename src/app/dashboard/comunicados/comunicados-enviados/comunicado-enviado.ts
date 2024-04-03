export interface comunicado_enviado {
  id: number
  fecha: string
  hora: string
  titulo: string
  descripcion: string
  adjuntos: comunicado_enviado_Adjunto[]
  destinatarios: comunicado_enviado_Destinatario[]
  porcentaje_lectura: number
  borrable: number
}

export interface comunicado_enviado_Adjunto {
  nombre_adjunto: string
  url: string
}

export interface comunicado_enviado_Destinatario {
  id_item: number
  alumno: string
  curso: string
  leido: number
  fecha_leido: string
  hora_leido: string
  mail_destinatario: string
}
