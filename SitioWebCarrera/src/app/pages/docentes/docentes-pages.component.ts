import { Component, signal } from '@angular/core';

// Interfaz para las publicaciones científicas
interface Publicacion {
  titulo: string;
  anio: number;
  enlace: string;
}

// Interfaz extendida para el Docente
interface Docente {
  nombre: string;
  especialidad: string;
  cargo: string;
  imagen: string;
  descripcion: string;
  email: string;
  telefono: string;
  publicaciones: Publicacion[];
}

@Component({
  selector: 'docentes',
  templateUrl: './docentes-pages.component.html',
  styleUrls: ['./docentes-pages.component.css']
})
export class DocentesPageComponent {

  // Signal para controlar qué docente se muestra en el detalle (modal)
  public docenteSeleccionado = signal<Docente | null>(null);

  // Signal con la lista completa de docentes y sus trayectorias
  public docentes = signal<Docente[]>([
    {
      nombre: 'Dr. Juan Pérez García',
      especialidad: 'Inteligencia Artificial',
      cargo: 'Investigador Senior',
      imagen: 'assets/docente1.png',
      descripcion: 'Experto en redes neuronales y aprendizaje profundo con más de 15 años de experiencia en investigación académica.',
      email: 'juan.perez@unistmo.edu.mx',
      telefono: '+52 (971) 123-4567',
      publicaciones: [
        { titulo: 'Optimización de Algoritmos Genéticos', anio: 2023, enlace: 'https://scholar.google.com' },
        { titulo: 'IA Aplicada a la Medicina Regional', anio: 2022, enlace: '#' }
      ]
    },
    {
      nombre: 'Dra. María López Hernández',
      especialidad: 'Desarrollo de Software',
      cargo: 'Coordinadora Académica',
      imagen: 'assets/docente2.png',
      descripcion: 'Especialista en arquitectura de software y metodologías ágiles. Lidera proyectos de transformación digital corporativa.',
      email: 'maria.lopez@unistmo.edu.mx',
      telefono: '+52 (971) 987-6543',
      publicaciones: [
        { titulo: 'Microservicios en la Nube: Un Enfoque Práctico', anio: 2024, enlace: '#' },
        { titulo: 'Metodologías Ágiles en la Educación Superior', anio: 2021, enlace: '#' }
      ]
    },
    {
      nombre: 'M.C. Carlos Ramírez Torres',
      especialidad: 'Sistemas Inteligentes',
      cargo: 'Catedrático',
      imagen: 'assets/docente3.png',
      descripcion: 'Enfocado en el desarrollo de sistemas embebidos y automatización industrial mediante lógica difusa.',
      email: 'carlos.ramirez@unistmo.edu.mx',
      telefono: '+52 (971) 456-7890',
      publicaciones: [
        { titulo: 'Automatización de Procesos con IoT', anio: 2023, enlace: '#' }
      ]
    },
    {
      nombre: 'Dra. Ana Martínez Cruz',
      especialidad: 'Bases de Datos',
      cargo: 'Especialista en Datos',
      imagen: 'assets/docente4.png',
      descripcion: 'Investigadora en minería de datos y bases de datos NoSQL de alta disponibilidad.',
      email: 'ana.martinez@unistmo.edu.mx',
      telefono: '+52 (971) 111-2222',
      publicaciones: [
        { titulo: 'Big Data en Entornos de Baja Conectividad', anio: 2022, enlace: '#' },
        { titulo: 'Seguridad en Transacciones Distribuidas', anio: 2020, enlace: '#' }
      ]
    },
    {
      nombre: 'M.C. Roberto Sánchez Díaz',
      especialidad: 'Redes y Seguridad',
      cargo: 'Consultor TI',
      imagen: 'assets/docente5.png',
      descripcion: 'Consultor experto en ciberseguridad, infraestructura de redes críticas y protocolos de cifrado.',
      email: 'roberto.sanchez@unistmo.edu.mx',
      telefono: '+52 (971) 333-4444',
      publicaciones: [
        { titulo: 'Análisis de Vulnerabilidades en Redes Locales', anio: 2023, enlace: '#' }
      ]
    },
    {
      nombre: 'Dra. Laura González Ruiz',
      especialidad: 'Ingeniería de Software',
      cargo: 'Analista de Sistemas',
      imagen: 'assets/docente6.png',
      descripcion: 'Analista enfocada en la calidad del software y pruebas automatizadas bajo estándares internacionales.',
      email: 'laura.gonzalez@unistmo.edu.mx',
      telefono: '+52 (971) 555-6666',
      publicaciones: [
        { titulo: 'Control de Calidad en Startups Tecnológicas', anio: 2024, enlace: '#' }
      ]
    }
  ]);

  /**
   * Abre el modal asignando el docente seleccionado
   */
  public abrirPerfil(docente: Docente): void {
    this.docenteSeleccionado.set(docente);
    // Opcional: Bloquear el scroll del body al abrir el modal
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal limpiando el signal
   */
  public cerrarPerfil(): void {
    this.docenteSeleccionado.set(null);
    // Restaurar el scroll del body
    document.body.style.overflow = 'auto';
  }
}