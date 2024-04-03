export interface destinatario {
    id: number
    nombre: string
    apellido: string
    id_curso: number
    id_nivel: number
    curso: string
    nivel: string
    id_familia: number
    nombre_familia: string
    responsables: ResponsableDestinatario[]
  }

export interface ResponsableDestinatario {
  id:number
  nombre:string
  vinculo:string
  id_chat:number
}

