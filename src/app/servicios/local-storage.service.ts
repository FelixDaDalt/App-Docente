import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  establecerItem(clave: string, valor: any): void {
    localStorage.setItem(clave, JSON.stringify(valor));
  }

   obtenerItem(clave: string): any {
    const item = localStorage.getItem(clave);
    return item ? JSON.parse(item) : null;
  }

  eliminarItem(clave: string): void {
    localStorage.removeItem(clave);
  }
}
