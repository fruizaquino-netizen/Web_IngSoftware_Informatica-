import { Routes } from '@angular/router';
import {InicioPageComponent} from './pages/inicio/inicio-pages.component';
import {QuienesSomosPageComponent} from './pages/quienesSomos/quienesSomos-page.component';
import {PlanEstudiosPageComponent} from './pages/planEstudio/PlanEstudio-page.component';
import {ProyectoPageComponent} from './pages/proyectos/proyectos-page.component';
import {DocentesPageComponent} from './pages/docentes/docentes-pages.component';
import {AspirantesPageComponent} from './pages/aspirantes/aspirantes-pages.component';
export const routes: Routes = [

  {
  path:'',
  component:InicioPageComponent

},
{
 path: 'quienesSomos',
 component:QuienesSomosPageComponent,
},
{
 path: 'planEstudios',
 component:PlanEstudiosPageComponent,
},
{
 path: 'proyectos',
 component:ProyectoPageComponent,
},
{
 path: 'docentes',
 component:DocentesPageComponent,
},
{
 path: 'aspirantes',
 component:AspirantesPageComponent,
}
];
