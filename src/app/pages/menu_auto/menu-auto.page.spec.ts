import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuAutoPage } from './menu-auto.page';

describe('MenuAutoPage', () => {
  let component: MenuAutoPage;
  let fixture: ComponentFixture<MenuAutoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
