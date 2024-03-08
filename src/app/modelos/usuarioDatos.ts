export interface usuarioDatos {
    id: number
    name: string
    real_name: string
    DNI: number
    email: string
    email_verified_at: string
    ID_Institucion: number
    ID_Usuario_Interno: number
    PasAct: number
    created_at: string
    updated_at: string
    Fecha_Alta: string
    IP_Alta: number
    Estado: string
    Aleatorio: string
    DeviceID: string
    Fecha_Baja: string
    Hora_Baja: string
    Motivo_Baja: string
    Instituciones: Institucion[]
    Institucion:string
    //locales
    Rol_selected?:rol
    Institucion_selected:Institucion
  }

  export interface Institucion {
    ID_Institucion: number
    ID_Usuario_Interno: number
    Institucion:string
    roles: rol[]
  }

  export interface rol {
    rol:string
    id_nivel:number
    descripcion:string
    comedor:number | string
  }
