// role.directive.ts
import { Directive, ElementRef, EventEmitter, Input, Optional, Output, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { DatosUsuarioService } from '../servicios/datos-usuario.service';

@Directive({
  selector: '[appRole], [appRoleReadonly], [appRoleDisabled], [appRoleAllowed]',
  standalone: true,
  host: {
    '[attr.disabled]': 'isDisabled ? "" : null'
  }
})
export class RoleDirective {
  private deniedRoles: string[] = [];
  private allowedRoles: string[] = [];
  isDisabled = false; // Variable para manejar el estado de 'disabled'
  rol:string=''

  @Input() set appRole(roles: string[]) {
    this.deniedRoles = roles;
    this.evaluateAccess();
  }

  @Input() set appRoleAllowed(roles: string[]) {

    this.allowedRoles = roles;
    this.evaluateAllowedAccess();
  }

  @Input() set appRoleReadonly(roles: string[]) {
    this.deniedRoles = roles;
    this.applyReadonly();
  }

  @Input() set appRoleDisabled(roles: string[]) {
    this.deniedRoles = roles;
    this.applyDisabled();
  }

  constructor(
    @Optional() private templateRef: TemplateRef<any>,
    @Optional() private viewContainer: ViewContainerRef,
    private authService: DatosUsuarioService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.authService.obtenerDatos().subscribe({
      next: (usuario) => {
        if (usuario && usuario.Institucion_selected && usuario.Rol_selected) {
          this.rol = usuario.Rol_selected.rol
        }
      }
    });
  }



  private evaluateAccess(): void {
    if (!this.templateRef || !this.viewContainer) return;
    if (this.deniedRoles.includes(this.rol)) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private applyReadonly(): void {
    if (this.deniedRoles.includes(this.rol)) {
      this.renderer.setAttribute(this.el.nativeElement, 'readonly', 'true');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'readonly');
    }
  }

  private applyDisabled(): void {
    this.isDisabled = this.deniedRoles.includes(this.rol);
  }

  private evaluateAllowedAccess(): void {
    if (!this.templateRef || !this.viewContainer) return;
    if (this.allowedRoles.length > 0 && !this.allowedRoles.includes(this.rol)) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
