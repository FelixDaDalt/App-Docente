export interface mensajeria{
  id_chat: number
  fecha: string
  hora: string
  usuario_destino: string
  id_destinatario: number
  tipo_remitente: number
  codigo: string
  familia: string
  alumno: string
  ultimo_mensaje: string
  leido: number
  sin_leer: number
  fecha_leido: string
  hora_leido: string
  id_alumno:number
}

export interface mensajeria_historial{
  id: number
  fecha: string
  hora: string
  usuario_destino: string
  tipo_remitente: number
  ultimo_mensaje: string
  leido: number
  fecha_leido: string
  hora_leido: string
}

export class nuevoChat{
  id_usuario:number
  id_familia:number
  id_alumno:number
  chat:string

  constructor(id_usuario:number,
    id_familia:number,
    id_alumno:number,
    chat:string){
      this.id_usuario = id_usuario
      this.id_familia = id_familia
      this.id_alumno = id_alumno
      this.chat = chat
    }
}
