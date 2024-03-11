import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/enviroments/environment';

@Component({
  selector: 'app-version-modal',
  templateUrl: './version-modal.component.html',
  styleUrls: ['./version-modal.component.css']
})
export class VersionModalComponent {

  @Input() versionActual?:string
  versionInstalada?:string

  constructor(public activeModal: NgbActiveModal){
    this.versionInstalada=environment.version
  }

  cerrarModal(){
    this.activeModal.close()
  }
}
