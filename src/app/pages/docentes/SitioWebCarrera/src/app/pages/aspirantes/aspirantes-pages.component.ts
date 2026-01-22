// Importa el decorador Component desde el núcleo de Angular
import { Component } from '@angular/core';

// Decorador que define la configuración del componente
@Component({
  // Selector HTML para usar este componente en otras vistas
  // Ejemplo: <app-aspirantes-pages></app-aspirantes-pages>
  selector: 'app-aspirantes-pages',

  // Archivo HTML que contiene la vista del componente
  templateUrl: './aspirantes-pages.component.html',

  // Archivo(s) CSS que contienen los estilos del componente
  styleUrls: ['./aspirantes-pages.component.css']
})

// Clase del componente
// Aquí se agrega la lógica, variables y métodos del componente
export class AspirantesPageComponent {}


