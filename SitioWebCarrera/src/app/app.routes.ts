import { Routes } from '@angular/router';
import { InicioPageComponent } from './pages/inicio/inicio-pages.component';
import { AlumnosPageComponent } from './pages/alumnos/alumnos-pages.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioPageComponent
  },
  {
    path: 'quienesSomos', // <--- Esta es la ruta que usaremos
    loadComponent: () => import('./pages/quienesSomos/quienesSomos-page.component')
      .then(m => m.QuienesSomosPageComponent)
  },
  {
    path: 'perfiles',
    loadComponent: () => import('./pages/perfiles/perfiles-page.component')
      .then(m => m.PerfilesPageComponent)
  },
  {
    path: 'perfil-carrera',
    loadComponent: () => import('./pages/perfiles/perfiles-page.component')
      .then(m => m.PerfilesPageComponent)
  },
  {
    path: 'recorrido-virtual',
    loadComponent: () => import('./pages/recorrido-virtual/recorrido-virtual-page.component')
      .then(m => m.RecorridoVirtualPageComponent)
  },
  {
    path: 'planEstudios',
    loadComponent: () => import('./pages/planEstudio/PlanEstudio-page.component')
      .then(m => m.PlanEstudiosPageComponent)
  },
  {
    path: 'horarios',
    loadComponent: () => import('./pages/horarios/horarios-page.component')
      .then(m => m.HorariosPageComponent)
  },
  {
    path: 'calendario',
    loadComponent: () => import('./pages/calendario/calendario-page.component')
      .then(m => m.CalendarioPageComponent)
  },
  {
    path: 'galeria',
    loadComponent: () => import('./pages/galeria/galeria-page.component')
      .then(m => m.GaleriaPageComponent)
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./pages/proyectos/proyectos-page.component')
      .then(m => m.ProyectoPageComponent)
  },
  {
    path: 'egresados',
    loadComponent: () => import('./pages/egresados/egresados-pages.component')
      .then(m => m.EgresadosPagesComponent)
  },
  {
    path: 'egresados-por-anio',
    loadComponent: () => import('./pages/egresados-por-anio/egresados-por-anio-page.component')
      .then(m => m.EgresadosPorAnioPageComponent)
  },
  {
    path: 'titulados-por-modalidad',
    loadComponent: () => import('./pages/titulados-por-modalidad/titulados-por-modalidad-page.component')
      .then(m => m.TituladosPorModalidadPageComponent)
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
    path: 'proceso-admision',
    loadComponent: () => import('./pages/proceso-admision/proceso-admision-page.component')
      .then(m => m.ProcesoAdmisionPageComponent)
  },
  {
    path: 'requisitos-admision',
    loadComponent: () => import('./pages/requisitos-admision/requisitos-admision-page.component')
      .then(m => m.RequisitosAdmisionPageComponent)
  },
  {
    path: 'mas-informacion',
    loadComponent: () => import('./pages/mas-informacion/mas-informacion-page.component')
      .then(m => m.MasInformacionPageComponent)
  },
  {
    path: 'alumnos', component: AlumnosPageComponent },

  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-panel/admin-panel.component')
      .then(m => m.AdminPanelComponent)
  },
  {
    path: 'excelecia-academica',
    loadComponent: () => import('./pages/inicio/excelencia/excelencia.component')
      .then(m => m.ExcelenciaComponent)
  },
  {
    path: 'tecnologia-avanzada',
    loadComponent: () => import('./pages/inicio/tecnologia/tecnologia.component')
      .then(m => m.TecnologiaComponent)
  },
  {
    path: 'vinculacion-regional',
    loadComponent: () => import('./pages/inicio/vinculacion/vinculacion.component')
      .then(m => m.VinculacionComponent)
  },
  {
  path: 'docente/:nombre',
  loadComponent: () => import('./pages/docentes-perfil/docentes-perfil.component')
    .then(m => m.DocentesPerfilComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
