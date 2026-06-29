import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

interface GaleriaItem {
  id: string;
  titulo?: string;
  categoria?: string;
  url: string;
  tipo: 'imagen' | 'video';
}

const defaultContent = {
  ALUMNOS: {
    GALLERY_TITLE: 'Galería',
    SUBTITLE: 'Conoce los momentos y vivencias de nuestros estudiantes.',
    EMPTY: 'Próximamente se publicará contenido de nuestra comunidad estudiantil.'
  }
};

@Component({
  selector: 'app-galeria-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './galeria-page.component.html',
  styleUrl: './galeria-page.component.css'
})
export class GaleriaPageComponent implements OnDestroy {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);
  private readonly galeriaApiUrl = 'http://localhost:3000/api/galeria';

  content = signal(defaultContent);
  items = signal<GaleriaItem[]>([]);
  currentIndex = signal(0);
  isModalOpen = signal(false);
  selectedItem = signal<GaleriaItem | null>(null);
  private autoplayInterval: any = null;

  constructor() {
    this.cargarGaleria();

    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/alumnos.${fileLang}.json`)
        .subscribe((data: any) => {
          this.content.set({
            ALUMNOS: {
              ...defaultContent.ALUMNOS,
              ...(data?.ALUMNOS || {})
            }
          });
        });
    });
  }

  private cargarGaleria(): void {
    this.http.get<GaleriaItem[]>(this.galeriaApiUrl).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          const soloImagenes = data
            .filter(item => item.tipo === 'imagen')
            .map(item => ({
              ...item,
              url: item.url.startsWith('http') ? item.url : `http://localhost:4200/${item.url}`
            }));
          this.items.set(soloImagenes);
          if (soloImagenes.length > 0) this.startAutoplay();
        }
      },
      error: () => this.items.set([])
    });
  }

  prev(): void {
    const total = this.items().length;
    if (total === 0) return;
    this.currentIndex.set((this.currentIndex() - 1 + total) % total);
    this.restartAutoplay();
  }

  next(): void {
    const total = this.items().length;
    if (total === 0) return;
    this.currentIndex.set((this.currentIndex() + 1) % total);
    this.restartAutoplay();
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.restartAutoplay();
  }

  openModal(item: GaleriaItem): void {
    this.selectedItem.set(item);
    this.isModalOpen.set(true);
    clearInterval(this.autoplayInterval);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedItem.set(null);
    this.startAutoplay();
  }

  private startAutoplay(): void {
    clearInterval(this.autoplayInterval);
    this.autoplayInterval = setInterval(() => {
      const total = this.items().length;
      if (total > 0) {
        this.currentIndex.set((this.currentIndex() + 1) % total);
      }
    }, 4000);
  }

  private restartAutoplay(): void {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoplayInterval);
  }
}
