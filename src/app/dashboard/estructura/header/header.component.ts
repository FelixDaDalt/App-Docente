import { Component,HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { resultadoBusqueda } from 'src/app/componentes/home/home';
import { HomeService } from 'src/app/componentes/home/home.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy{
  isSearchVisible = false;
  isHeaderActive: boolean = true;


  private busquedaSubscription?: Subscription;
  terminoBusqueda:string=""

  constructor(private homeService:HomeService, private route:Router){

  }


  ngOnDestroy(): void {
    this.busquedaSubscription?.unsubscribe()
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrolled = window.scrollY;
    this.isHeaderActive = scrolled <= 20;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
    if (this.isSearchVisible) {
      this.suscripcionBusqueda();
    } else {
      this.desuscribirBusqueda();
    }
  }


  private suscripcionBusqueda(){
    this.busquedaSubscription = this.homeService.suscripcionBusqueda().subscribe({
      next:(resultado)=>{
        if(resultado.length>0){
          this.toggleSearch()
          this.route.navigate(['dashboard','resultado', this.terminoBusqueda]);
        }

      }
    })
  }

  private desuscribirBusqueda() {
    if (this.busquedaSubscription) {
      this.busquedaSubscription.unsubscribe();
    }
  }

  buscar(){
    this.homeService.buscarAlumno(this.terminoBusqueda)
  }

}
