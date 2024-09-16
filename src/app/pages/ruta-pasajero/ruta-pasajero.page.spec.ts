import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutaPasajeroPage } from './ruta-pasajero.page';

describe('RutaPasajeroPage', () => {
  let component: RutaPasajeroPage;
  let fixture: ComponentFixture<RutaPasajeroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaPasajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
