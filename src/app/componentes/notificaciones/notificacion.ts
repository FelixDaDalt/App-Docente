export interface notificacion {
    familiares: number
    detalle_familiares: DetalleFamiliar[]
    entrevistas: number
    detalle_entrevistas: DetalleEntrevista[]
    avisos: number
    detalle_avisos: DetalleAviso[]
    sanciones: number
    detalle_sanciones: DetalleSancion[]
    documentacion: number
    detalle_documentacion: DetalleDocumentacion[]
    pedagogicas: number
    detalle_pedagogicas: DetallePedagogico[]
    faltas: number
    detalle_faltas: DetalleFalta[]
    avisos_retiro: number
    detalle_avisos_retiro: DetalleRetiros[]
    rta_solicitudes_reunion:number
    detalle_rta_solicitudes_reunion:DetalleReunion[]
  }

  export interface DetalleFamiliar {
    id: number
    fecha: string
    hora: string
    alumno: string
    cursos: string
    descripcion: string
    leido: number
    clasificada: number
  }

  export interface DetalleEntrevista {
    id: number
    fecha: string
    hora: string
    alumno: string
    cursos: string
    motivo: string
    comentarios: string
    objetivos: string
    presentes: string
    tipo: string
    autor: string
    leido: number
    clasificada: number
  }

  export interface DetalleAviso {
    id: number
    fecha: string
    descripcion: string
    tipo_RI: string
    constancia: string
    leido: number
    alumno:string
  }

  export interface DetalleSancion {
    id: number
    fecha: string
    tipo: string
    tipo_detalle: string
    descripcion: string
    autor: string
    estado: number
    leido: number
    alumno:string
  }

  export interface DetalleDocumentacion {
    id: number
    fecha: string
    alumno: string
    titulo: string
    descripcion: string
    archivo_url: string
    leido: number
    confidencial: number
  }

  export interface DetallePedagogico {
    id: number
    fecha: string
    alumno: string
    descripcion: string
    leido: number
    clasificada: number
    registro:string
  }

  export interface DetalleFalta {
    id: number
    fecha: string
    alumno: string
    profesor: string
    descripcion: string
    gravedad_falta: string
    descripcion_falta: string
    leido: number
  }

  export interface DetalleRetiros {
    id: number
    fecha_generacion: string
    alumno: string
    persona_autorizada: string
    dni_persona_autorizada: number
    foto_persona_autorizada: string
    vinculo_persona_autorizada: string
    detalle: string
    leido: number
  }

  export interface DetalleReunion{
    id: number
    fecha_rta: string
    alumno: string
    titulo: string
    mensaje: string
    respuesta: number
    respuesta_status: string
    respuesta_usuario: string
    leido: number
  }
