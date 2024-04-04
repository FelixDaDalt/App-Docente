export class home{
    novedades:novedades[] = []
    notificaciones!:notificacionHome

    constructor(novedades?:novedades[]){
        novedades?this.novedades = novedades : this.novedades=[]
    }


}

export interface materias{
    id: number
    materia: string
    curso: string
    tipo_materia: string
    cantidad_clases:number
    cantidad_alumnos:number
}

export interface novedades{
    encabezado: string
    tipo: string
    titulo: string
    descripcion: string
}

export interface notificacionHome{
    comunicados: number
    mensajes: number
    notificaciones: number
    requerimientos: string
}

export interface resultadoBusqueda{
  id: number
  id_situacion: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  curso: string
  dni: string
  direccion: string
  telefono: string
  libro_folio: string
  avatar_url: string
  responsables: Responsable[]
  situacion:string
  autorizaciones_retiro: autorizacion_retiro[]

}

export interface Responsable {
  nombre: string
  email: string
}

export interface alumno{
  id:number,
  apellido:string,
  nombre:string,
  dni:string,
  avatar:string,
  inasistencias:number
}

export interface autorizacion_retiro {
  apellido: string
  nombre: string
  dni: number
  vinculo: string
  temporal: number
}
