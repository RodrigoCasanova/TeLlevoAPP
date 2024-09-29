import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPasajeroPage } from './menu-pasajero.page';

describe('MenuPasajeroPage', () => {
  let component: MenuPasajeroPage;
  let fixture: ComponentFixture<MenuPasajeroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPasajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
