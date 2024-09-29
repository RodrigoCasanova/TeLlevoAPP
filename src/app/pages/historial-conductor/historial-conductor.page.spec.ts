import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialConductorPage } from './historial-conductor.page';

describe('HistorialConductorPage', () => {
  let component: HistorialConductorPage;
  let fixture: ComponentFixture<HistorialConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
