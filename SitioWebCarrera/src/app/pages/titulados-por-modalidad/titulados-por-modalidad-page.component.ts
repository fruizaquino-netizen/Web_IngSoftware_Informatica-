import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

type ModalidadFiltro = 'todos' | 'tesis' | 'ceneval' | 'experiencia';

interface Egresado {
  nombre: string;
  anio: number;
  modalidad: 'tesis' | 'ceneval' | 'experiencia';
}

const defaultContent = {
  EGRESADOS: {
    BY_MODALITY: 'Titulados por Modalidad',
    SUBTITLE: 'Información estadística y académica de los egresados de la carrera.',
    FILTER_ALL: 'Todos',
    FILTER_TESIS: 'Tesis',
    FILTER_CENEVAL: 'CENEVAL',
    FILTER_EXPERIENCE: 'Experiencia',
    TOTAL_PREFIX: 'Total de Titulados',
    TOTAL_REGISTERED: 'registrados',
    TOTAL_IN_MODALITY: 'en modalidad',
    LIST_TITLE: 'Listado de Titulados',
    TABLE_NAME: 'Nombre',
    TABLE_YEAR: 'Año',
    TABLE_MODALITY: 'Modalidad',
    NO_RESULTS: 'No hay egresados para la modalidad seleccionada.'
  }
};

@Component({
  selector: 'app-titulados-por-modalidad-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './titulados-por-modalidad-page.component.html',
  styleUrl: './titulados-por-modalidad-page.component.css'
})
export class TituladosPorModalidadPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);
  private readonly apiUrl = 'http://localhost:3000/api/egresados';

  content = signal(defaultContent);
  egresados = signal<Egresado[]>([]);
  filtroActivo = signal<ModalidadFiltro>('todos');

  egresadosFiltrados = computed(() => {
    if (this.filtroActivo() === 'todos') return this.egresados();
    return this.egresados().filter((egresado) => egresado.modalidad === this.filtroActivo());
  });

  totalSegunFiltro = computed(() => this.egresadosFiltrados().length);

  constructor() {
    this.cargarEgresados();

    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/egresados.${fileLang}.json`, { responseType: 'text' })
        .subscribe((text) => {
          this.content.set(
            parseJsonWithBom<typeof defaultContent>(text, defaultContent, `egresados.${fileLang}.json`)
          );
        });
    });
  }

  cambiarFiltro(filtro: ModalidadFiltro): void {
    this.filtroActivo.set(filtro);
  }

  getFiltroLabel(filtro: ModalidadFiltro): string {
    const labels = this.content().EGRESADOS;
    if (filtro === 'todos') return labels.FILTER_ALL;
    if (filtro === 'tesis') return labels.FILTER_TESIS;
    if (filtro === 'ceneval') return labels.FILTER_CENEVAL;
    return labels.FILTER_EXPERIENCE;
  }

  private cargarEgresados(): void {
    this.http.get<Egresado[]>(this.apiUrl).subscribe({
      next: (egresados) => {
        this.egresados.set(Array.isArray(egresados) ? egresados : []);
      },
      error: () => this.egresados.set([])
    });
  }
}
