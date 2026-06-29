
import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

interface Egresado {
  nombre: string;
  anio: number;       //campo interno correcto (sin tilde, es el key del API)
  modalidad: 'tesis' | 'ceneval' | 'experiencia';
  foto?: string;      //campo opcional de foto
}

const defaultContent = {
  EGRESADOS: {
    TITLE: 'Registro de los Egresados',
    SUBTITLE: 'Información estadística y académica de los egresados de la carrera.',
    BY_YEAR: 'Egresados por Año',
    BY_MODALITY: 'Titulados por Modalidad',
    FILTER_ALL: 'Todos',
    FILTER_TESIS: 'Tesis',
    FILTER_CENEVAL: 'CENEVAL',
    FILTER_EXPERIENCE: 'Experiencia',
    SINGULAR: 'egresado',
    PLURAL: 'egresados',
    TOTAL_PREFIX: 'Total de Titulados',
    TOTAL_REGISTERED: 'registrados',
    TOTAL_IN_MODALITY: 'en modalidad',
    LIST_TITLE: 'Listado de Titulados',
    TABLE_NAME: 'Nombre',
    TABLE_YEAR: 'Año',
    TABLE_MODALITY: 'Modalidad',
    NO_RESULTS: 'No hay egresados para la modalidad seleccionada.',
    MODAL_TITLE: 'Generación',
    MODAL_CLOSE: 'Cerrar'
  }
};

@Component({
  selector: 'app-egresados-pages',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './egresados-pages.component.html',
  styleUrl: './egresados-pages.component.css'
})
export class EgresadosPagesComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);
  private readonly apiUrl = 'http://localhost:3000/api/egresados';

  content = signal(defaultContent);

  //  Datos base
  egresados = signal<Egresado[]>([]);

  //  Filtro activo
  filtroActivo = signal<'todos' | 'tesis' | 'ceneval' | 'experiencia'>('todos');

  constructor() {
    this.cargarEgresados();

    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/egresados.${fileLang}.json`)
        .subscribe((data) => {
          this.content.set(data as typeof defaultContent);
        });
    });
  }

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

  getFiltroLabel(filtro: 'todos' | 'tesis' | 'ceneval' | 'experiencia'): string {
    const labels = this.content().EGRESADOS;
    if (filtro === 'todos') return labels.FILTER_ALL;
    if (filtro === 'tesis') return labels.FILTER_TESIS;
    if (filtro === 'ceneval') return labels.FILTER_CENEVAL;
    return labels.FILTER_EXPERIENCE;
  }

  private cargarEgresados(): void {
    this.http.get<Egresado[]>(this.apiUrl).subscribe({
      next: (egresados) => {
        if (Array.isArray(egresados)) {
          this.egresados.set(egresados);
        }
      },
      error: (error) => {
        console.error('Error al cargar egresados desde la API:', error);
        this.egresados.set([]);
      }
    });
  }
}
