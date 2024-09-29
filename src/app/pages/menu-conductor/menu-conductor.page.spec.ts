import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuConductorPage } from './menu-conductor.page';

describe('MenuConductorPage', () => {
  let component: MenuConductorPage;
  let fixture: ComponentFixture<MenuConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
