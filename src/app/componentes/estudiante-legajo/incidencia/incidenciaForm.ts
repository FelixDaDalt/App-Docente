export interface Detalle {
  id: number;
  name: string;
  nombre: string;
  tipo: string;
  obligatorio: number;
  desplegable?:Desplegable[]
}

export interface IncidenciaForm {
  id: number;
  incidencia: string;
  detalle: Detalle[];
  historial:historial[]
}

export interface historial{
  id:number;
  fecha:string;
  titulo:string;
  descripcion:string;
  registro:string;
}

export interface Desplegable{
  id:number;
  categoria:string
}
