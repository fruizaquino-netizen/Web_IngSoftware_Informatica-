import { Component, signal } from '@angular/core';

interface Docente {
  nombre: string;
  especialidad: string;
  cargo: string;
  imagen: string;
}

@Component({
  selector: 'docentes',
  templateUrl: './docentes-pages.component.html',
  styleUrls: ['./docentes-pages.component.css']
})

export class DocentesPageComponent {
  
  // Usamos un signal para manejar el estado de los docentes
  public docentes = signal<Docente[]>([
    {
      nombre: 'Dr. Juan Pérez García',
      especialidad: 'Inteligencia Artificial',
      cargo: 'Investigador Senior',
      imagen: 'assets/docente1.png'
    },
    {
      nombre: 'Dra. María López Hernández',
      especialidad: 'Desarrollo de Software',
      cargo: 'Coordinadora Académica',
      imagen: 'assets/docente2.png'
    },
    {
      nombre: 'M.C. Carlos Ramírez Torres',
      especialidad: 'Sistemas Inteligentes',
      cargo: 'Catedrático',
      imagen: 'assets/docente3.png'
    },
    {
      nombre: 'Dra. Ana Martínez Cruz',
      especialidad: 'Bases de Datos',
      cargo: 'Especialista en Datos',
      imagen: 'assets/docente4.png'
    },
    {
      nombre: 'M.C. Roberto Sánchez Díaz',
      especialidad: 'Redes y Seguridad',
      cargo: 'Consultor TI',
      imagen: 'assets/docente5.png'
    },
    {
      nombre: 'Dra. Laura González Ruiz',
      especialidad: 'Ingeniería de Software',
      cargo: 'Analista de Sistemas',
      imagen: 'assets/docente6.png'
    }
  ]);
}