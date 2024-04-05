import { Component,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/componentes/home/home.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{
  isSearchVisible = false;
  isHeaderActive: boolean = true;
  terminoBusqueda:string=""

  constructor(private homeService:HomeService, private route:Router){}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrolled = window.scrollY;
    this.isHeaderActive = scrolled <= 20;
  }

  toggleSearch() {
    if (!this.isSearchVisible) {

      this.isSearchVisible = true;

    } else {

      this.isSearchVisible = false;

    }
  }


  buscar(){
    this.homeService.buscarAlumno(this.terminoBusqueda)
    this.terminoBusqueda=""
    this.toggleSearch()
    this.route.navigate(['dashboard','resultado', this.terminoBusqueda]);
  }

}
