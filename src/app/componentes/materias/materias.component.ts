import { Component, OnDestroy, OnInit } from '@angular/core';
import { MateriasService } from './materias.service';
import { materias } from '../home/home';
import { Observable, Subscription } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnDestroy, OnInit{

  usuario$?:Observable<usuarioDatos | null>
  private suscriberMateria?:Subscription
  materia?:materias | null
  suscripcionesActivas = 0;

  constructor(private materiaService:MateriasService,
    private usuarioService:DatosUsuarioService,
    private route:Router){}

  ngOnInit(): void {
    this.suscripcionMateria()
    this.suscripcionUsuario()
  }

  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe();
  }

  private suscripcionUsuario(){
    this.usuario$ = this.usuarioService.obtenerDatos()
  }

  private suscripcionMateria(){
    if(this.suscriberMateria){
      this.suscriberMateria.unsubscribe()
    }

    this.suscriberMateria = this.materiaService.suscripcionMateria().subscribe({
      next:(materia)=>{
        if(materia)
        this.materia = materia
        else
        this.route.navigate(['dashboard'])
      }
    })
  }
}
