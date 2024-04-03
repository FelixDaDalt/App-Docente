import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorFormularios'
})
export class ErrorFormulariosPipe implements PipeTransform {

  transform(errors: any, fieldName: string): string {
    if (errors) {
      if (errors.required) {
        return `${fieldName} es requerido.`;
      } else if (errors.email) {
        return `El ${fieldName} no es válido.`;
      } else if (errors.minlength) {
        return `${fieldName} debe tener al menos ${errors.minlength.requiredLength} caracteres.`;
      } // Agrega más lógica para otros tipos de errores aquí si es necesario
    }
    return '';
  }

}
