// Importa el decorador Component desde el núcleo de Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Decorador que define la configuración del componente
@Component({
  // Selector HTML para usar este componente en otras vistas
  // Ejemplo: <app-aspirantes-pages></app-aspirantes-pages>
  selector: 'app-aspirantes-pages',
  standalone: true,            // ✅
  imports: [CommonModule],     // ✅

  // Archivo HTML que contiene la vista del componente
  templateUrl: './aspirantes-pages.component.html',

  // Archivo(s) CSS que contienen los estilos del componente
  styleUrls: ['./aspirantes-pages.component.css']
})


// Clase del componente
// Aquí se agrega la lógica, variables y métodos del componente
export class AspirantesPageComponent {
  testimonios = [
    {
      frase: 'La carrera me brindó las herramientas necesarias para ingresar al mundo laboral',
      nombre: 'Juan Pérez',
      generacion: 'Egresado 2022'
    },
    {
      frase: 'Los proyectos prácticos marcaron la diferencia en mi formación',
      nombre: 'María López',
      generacion: 'Egresada 2021'
    },
    {
      frase: 'Excelente nivel académico y docentes comprometidos',
      nombre: 'Carlos Gómez',
      generacion: 'Egresado 2020'
    }
  ];

  testimonioActivo: any = null;

  openTestimonio(testimonio: any) {
    this.testimonioActivo = testimonio;
    document.body.style.overflow = 'hidden';
  }

  closeTestimonio() {
    this.testimonioActivo = null;
    document.body.style.overflow = '';
  }


}


