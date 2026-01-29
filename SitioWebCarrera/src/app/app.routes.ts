import { Routes } from '@angular/router';
// Importamos SOLO el inicio para que cargue rápido al entrar
import { InicioPageComponent } from './pages/inicio/inicio-pages.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioPageComponent
  },
  {
    path: 'quienesSomos',
    // Aquí empieza la magia del Lazy Loading
    loadComponent: () => import('./pages/quienesSomos/quienesSomos-page.component')
      .then(m => m.QuienesSomosPageComponent)
  },
  {
    path: 'planEstudios',
    loadComponent: () => import('./pages/planEstudio/PlanEstudio-page.component')
      .then(m => m.PlanEstudiosPageComponent)
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./pages/proyectos/proyectos-page.component')
      .then(m => m.ProyectoPageComponent)
  },
  {
    path: 'docentes',
    loadComponent: () => import('./pages/docentes/docentes-pages.component')
      .then(m => m.DocentesPageComponent)
  },
  {
    path: 'aspirantes',
    loadComponent: () => import('./pages/aspirantes/aspirantes-pages.component')
      .then(m => m.AspirantesPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
