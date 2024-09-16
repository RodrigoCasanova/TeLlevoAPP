import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutaConductorPage } from './ruta-conductor.page';

describe('RutaConductorPage', () => {
  let component: RutaConductorPage;
  let fixture: ComponentFixture<RutaConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
