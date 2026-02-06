import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Egresado {
  nombre: string;
  anio: number;
  modalidad: 'tesis' | 'ceneval' | 'experiencia';
}

@Component({
  selector: 'app-egresados-pages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './egresados-pages.component.html',
  styleUrl: './egresados-pages.component.css'
})
export class EgresadosPagesComponent {

  //  Datos base
  egresados = signal<Egresado[]>([
    { nombre: 'Candy Beltran', anio: 2020, modalidad: 'ceneval' },
    { nombre: 'Monserrat Diaz', anio: 2021, modalidad: 'ceneval' },
    { nombre: 'Ricardo Hernandez', anio: 2022, modalidad: 'ceneval' },
    { nombre: 'Mariano Cruz', anio: 2023, modalidad: 'tesis' },
    { nombre: 'Maria Vazquez', anio: 2023, modalidad: 'tesis' },
    { nombre: 'Juan Diego Ruiz', anio: 2024, modalidad: 'tesis' },
    { nombre: 'Miranda Monraz', anio: 2024, modalidad: 'experiencia' },
    { nombre: 'Blanca soto', anio: 2024, modalidad: 'experiencia' },
    { nombre: 'Efren Gómez', anio: 2024, modalidad: 'tesis' },
    { nombre: 'Chamber Ruiz', anio: 2024, modalidad: 'ceneval' },
    { nombre: 'Clarissa Vazquez', anio: 2025, modalidad: 'ceneval' },
    { nombre: 'Kevin Ramirez', anio: 2025, modalidad: 'experiencia' },
    { nombre: 'Araceli Bautista', anio: 2025, modalidad: 'ceneval' }

  ]);

  //  Filtro activo
  filtroActivo = signal<'todos' | 'tesis' | 'ceneval' | 'experiencia'>('todos');

  //  Lista filtrada (reemplaza al pipe)
  egresadosFiltrados = computed(() => {
    if (this.filtroActivo() === 'todos') {
      return this.egresados();
    }
    return this.egresados().filter(
      e => e.modalidad === this.filtroActivo()
    );
  });

  //  Conteo automático por año
  conteoPorAnio = computed(() => {
    const conteo: Record<number, number> = {};

    this.egresados().forEach(e => {
      conteo[e.anio] = (conteo[e.anio] || 0) + 1;
    });

    return conteo;
  });

  //  Lista de años disponibles (ordenados)
  aniosDisponibles = computed(() =>
    Object.keys(this.conteoPorAnio())
      .map(anio => Number(anio))
      .sort()
  );
// Año seleccionado para el modal
anioSeleccionado = signal<number | null>(null);

// Egresados del año seleccionado
egresadosPorAnioSeleccionado = computed(() => {
  if (this.anioSeleccionado() === null) {
    return [];
  }

  return this.egresados().filter(
    e => e.anio === this.anioSeleccionado()
  );
});

// Abrir modal
abrirModalPorAnio(anio: number) {
  this.anioSeleccionado.set(anio);
}

// Cerrar modal
cerrarModal() {
  this.anioSeleccionado.set(null);
}

// Total dinámico según el filtro activo
totalSegunFiltro = computed(() => {
  return this.egresadosFiltrados().length;
});
  //  Acción de botones
  cambiarFiltro(filtro: 'todos' | 'tesis' | 'ceneval' | 'experiencia') {
    this.filtroActivo.set(filtro);
  }
}
