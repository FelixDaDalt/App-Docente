import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from './spinner.service';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent{

  @Output() spinnerCargando: EventEmitter<boolean> = new EventEmitter<boolean>();
  public mostrarSpinner: boolean = false;

  constructor(private spinnerService:SpinnerService){
    this.cargando()
  }

  cargando(){
    this.spinnerService.spinnerState$.subscribe((state) => {
      this.spinnerCargando.emit(state)
      this.mostrarSpinner=state
    });
  }


}
