import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'transporte',
    loadChildren: () => import('./pages/transporte/transporte.module').then( m => m.TransportePageModule)
  },
  {
    path: 'conductor',
    loadChildren: () => import('./pages/conductor/conductor.module').then( m => m.ConductorPageModule)
  },
  {
    path: 'auto',
    loadChildren: () => import('./pages/auto/auto.module').then( m => m.AutoPageModule)
  },
  {
    path: 'menu_auto',
    loadChildren: () => import('./pages/menu_auto/menu-auto.module').then( m => m.MenuAutoPageModule)
  },
  {
    path: 'viaje-conductor',
    loadChildren: () => import('./pages/viaje-conductor/viaje-conductor.module').then( m => m.ViajeConductorPageModule)
  },
  {
    path: 'viaje-pasajero',
    loadChildren: () => import('./pages/viaje-pasajero/viaje-pasajero.module').then( m => m.ViajePasajeroPageModule)
  },
  {
    path: 'ruta-conductor',
    loadChildren: () => import('./pages/ruta-conductor/ruta-conductor.module').then( m => m.RutaConductorPageModule)
  },
  {
    path: 'ruta-pasajero',
    loadChildren: () => import('./pages/ruta-pasajero/ruta-pasajero.module').then( m => m.RutaPasajeroPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },


 
  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
