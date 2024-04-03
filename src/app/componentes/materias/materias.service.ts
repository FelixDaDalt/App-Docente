import { Injectable } from '@angular/core';
import { materias } from '../home/home';
import { BehaviorSubject } from 'rxjs';
import { libroTema } from '../libro-tema/libro-tema';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  private materia$ = new BehaviorSubject<materias | null>(null)


  constructor() { }

  setMateria(materia:materias){
    this.materia$.next(materia)
  }

  suscripcionMateria(){
    return this.materia$.asObservable()
  }

}
