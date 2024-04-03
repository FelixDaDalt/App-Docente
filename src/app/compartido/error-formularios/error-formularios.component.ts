import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-error-formularios',
  templateUrl: './error-formularios.component.html',
  styleUrls: ['./error-formularios.component.css']
})
export class ErrorFormulariosComponent {
  @Input() control!: FormControl;
  @Input() fieldName!: string;
}
