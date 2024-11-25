import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarDatosPage } from './actualizar-datos.page';

describe('ActualizarDatosPage', () => {
  let component: ActualizarDatosPage;
  let fixture: ComponentFixture<ActualizarDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
