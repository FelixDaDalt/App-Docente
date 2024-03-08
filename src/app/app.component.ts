import { Component} from '@angular/core';
import { AutentificacionService } from './servicios/autentificacion.service';
import { NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'App-Docente';

  login=false
  isMensajeriaComponent: boolean = false;

  constructor(private autentificacionService:AutentificacionService,

    private router:Router){
      this.autenticado()
      setTimeout(() => {
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.isMensajeriaComponent =  this.router.url.includes('mensajeria-historial')
          }
        });
      }, 10);

  }




  autenticado() {
    this.autentificacionService.estaAutenticado().subscribe({
      next: (autentificado: boolean) => {
        this.login = autentificado;
        this.router.navigate(['/home']);
      }
    });
  }



}
