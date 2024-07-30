import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {

  formulario!: FormGroup;

  constructor(private active:NgbActiveModal, private fb: FormBuilder){
    this.formulario = this.fb.group({
      alumno: ['', Validators.required],
      motivo: ['', Validators.required],
    });
  }



  nuevoRegistro(){
    this.active.close(this.formulario.value)
  }

  formControls(nombre:string) {
    return this.formulario.controls[nombre] as FormControl
  }

}
