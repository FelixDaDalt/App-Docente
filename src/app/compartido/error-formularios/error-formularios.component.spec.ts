import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFormulariosComponent } from './error-formularios.component';

describe('ErrorFormulariosComponent', () => {
  let component: ErrorFormulariosComponent;
  let fixture: ComponentFixture<ErrorFormulariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorFormulariosComponent]
    });
    fixture = TestBed.createComponent(ErrorFormulariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
