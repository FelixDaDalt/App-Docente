import { Component, OnDestroy, OnInit } from '@angular/core';
import { materias } from '../home/home';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { usuarioDatos } from 'src/app/modelos/usuarioDatos';
import { DatosUsuarioService } from 'src/app/servicios/datos-usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnDestroy, OnInit{

  usuario$?:Observable<usuarioDatos | null>
  private suscriberMateria?:Subscription
  materia$=new BehaviorSubject<materias | null>(null)


  constructor(
    private usuarioService:DatosUsuarioService,
    private route:Router,
    private homeService:HomeService,
    private activedRoute:ActivatedRoute){}

  ngOnInit(): void {
   this.activedRoute.params.subscribe(params => {
      if(params)
      {
        this.suscripcionUsuario()
        this.suscripcionMateria(Number(params['id']))
      }else{
        this.route.navigate(['dashboard'])
      }
    });
  }

  ngOnDestroy(): void {
    this.suscriberMateria?.unsubscribe();

  }

  private suscripcionUsuario(){
    this.usuario$ = this.usuarioService.obtenerDatos()
  }

  private suscripcionMateria(params:number){
    this.suscriberMateria = this.homeService.suscribirseMaterias()
    .pipe(
      map(materias => materias.find(x=>x.id == params))
    )
    .subscribe({
      next:(materia)=>{
        if(materia){
          this.materia$.next(materia)
        }
        else{
          this.route.navigate(['dashboard'])
        }
      }
    })
  }
}
