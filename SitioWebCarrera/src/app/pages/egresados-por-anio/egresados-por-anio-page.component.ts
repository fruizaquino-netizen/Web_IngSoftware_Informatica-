import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

interface Egresado {
  nombre: string;
  anio: number;
  modalidad: 'tesis' | 'ceneval' | 'experiencia';
  foto?: string;
}

const defaultContent = {
  EGRESADOS: {
    BY_YEAR: 'Egresados por Año',
    SUBTITLE: 'Información estadística y académica de los egresados de la carrera.',
    SINGULAR: 'egresado',
    PLURAL: 'egresados',
    TABLE_NAME: 'Nombre',
    TABLE_MODALITY: 'Modalidad',
    FILTER_ALL: 'Todos',
    FILTER_TESIS: 'Tesis',
    FILTER_CENEVAL: 'CENEVAL',
    FILTER_EXPERIENCE: 'Experiencia',
    MODAL_TITLE: 'Generación'
  }
};

@Component({
  selector: 'app-egresados-por-anio-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './egresados-por-anio-page.component.html',
  styleUrl: './egresados-por-anio-page.component.css'
})
export class EgresadosPorAnioPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);
  private readonly apiUrl = 'http://localhost:3000/api/egresados';

  content = signal(defaultContent);
  egresados = signal<Egresado[]>([]);
  anioSeleccionado = signal<number | null>(null);

  conteoPorAnio = computed(() => {
    const conteo: Record<number, number> = {};
    this.egresados().forEach((egresado) => {
      conteo[egresado.anio] = (conteo[egresado.anio] || 0) + 1;
    });
    return conteo;
  });

  aniosDisponibles = computed(() =>
    Object.keys(this.conteoPorAnio())
      .map((anio) => Number(anio))
      .sort()
  );

  egresadosPorAnioSeleccionado = computed(() => {
    const anio = this.anioSeleccionado();
    if (anio === null) return [];
    return this.egresados().filter((egresado) => egresado.anio === anio);
  });

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

  abrirModalPorAnio(anio: number): void {
    this.anioSeleccionado.set(anio);
  }

  cerrarModal(): void {
    this.anioSeleccionado.set(null);
  }

  getFiltroLabel(filtro: 'tesis' | 'ceneval' | 'experiencia'): string {
    const labels = this.content().EGRESADOS;
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
