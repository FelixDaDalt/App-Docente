import { Injectable } from '@angular/core';
import { usuarioDatos } from '../modelos/usuarioDatos';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  private usuarioDatosSubject = new BehaviorSubject<usuarioDatos | null>(null);
  private usuarioKey = 'usuario_App_Geo';

  constructor(private localStorageService: LocalStorageService) {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    const storedData = this.localStorageService.obtenerItem(this.usuarioKey);
    if (storedData) {
      this.usuarioDatosSubject.next(storedData);
    }
  }

  establecerDatos(usuarioDatos: usuarioDatos): void {
    this.localStorageService.establecerItem(this.usuarioKey, usuarioDatos);
    this.usuarioDatosSubject.next(usuarioDatos);
  }

  obtenerDatos(): Observable<usuarioDatos | null> {
    return this.usuarioDatosSubject.asObservable();
  }

  elminarDatos(): void {
    this.localStorageService.eliminarItem(this.usuarioKey);
    this.usuarioDatosSubject.next(null);
  }
}
