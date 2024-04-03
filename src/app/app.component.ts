import { Component} from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'App-Docente';

  isMensajeriaComponent: boolean = false;
  isLogin:boolean = false

  constructor(private router:Router){

      setTimeout(() => {
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {

            this.isMensajeriaComponent =  this.router.url.includes('mensajeria-historial')
          }
        });
      }, 10);

  }

}
