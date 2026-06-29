import { Component, computed, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

const defaultContent = {
  text: {
    projectsTitle: 'Proyectos',
    projectsDescription: 'Conoce los proyectos...',
    videosTitle: 'Videos',
    watchMore: 'Ver Más',
    close: 'Cerrar',
    members: 'Integrantes',
    gallery: 'Galería',
    video: 'Video',
    videoFallback: 'Tu navegador no soporta videos HTML5.'
  },
  filters: [
    { id: 'filter-all', key: 'all', label: 'Todos' },
    { id: 'filter-software', key: 'software', label: 'Desarrollo de Software' },
    { id: 'filter-sistemas', key: 'sistemas', label: 'Sistemas Inteligentes' }
  ],
  projects: [],
  videos: []
};

@Component({
  selector: 'proyecto',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './proyectos-page.component.html',
  styleUrls: ['./proyectos-page.component.css']
})
export class ProyectoPageComponent {
  public translation = inject(TranslationService);
  private readonly proyectosApiUrl = 'http://localhost:3000/api/proyectos';
  private readonly videosApiUrl = 'http://localhost:3000/api/videos';

  content = signal<any>(defaultContent);
  activeFilter = signal<'all' | 'software' | 'sistemas'>('all');

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/proyectos.${fileLang}.json`, { responseType: 'text' })
        .subscribe((text) => {
          this.content.set({
            ...parseJsonWithBom<typeof defaultContent>(text, defaultContent, `proyectos.${fileLang}.json`),
            projects: [],
            videos: []
          });
          const keys = new Set(this.content().filters.map((f: { key: string }) => f.key));
          if (!keys.has(this.activeFilter())) {
            this.activeFilter.set('all');
          }
          this.cargarProyectos();
          this.cargarVideos();
        });
    });
  }

  filteredProjects = computed(() => {
    const filterKey = this.activeFilter();
    const items = this.content().projects;
    if (filterKey === 'all') return items;
    return items.filter((project: { categoryKey: string }) => project.categoryKey === filterKey);
  });

  safeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setActiveFilter(key: 'all' | 'software' | 'sistemas') {
    this.activeFilter.set(key);
  }

  private cargarProyectos(): void {
    this.http.get<any[]>(this.proyectosApiUrl).subscribe({
      next: (projects) => {
        if (!Array.isArray(projects)) return;
        this.content.update((current) => ({
          ...current,
          projects: projects.map((project, index) => ({
            id: index + 1,
            categoryKey: project.categoryKey,
            categoryLabel: project.categoryLabel,
            title: project.title,
            summary: project.summary,
            image: project.image,
            modal: {
              description: project.description,
              members: (project.miembros || []).map((m: any) => m.nombre),
              gallery: (project.galeria || []).map((media: any) => ({
                url: media.url,
                tipo: media.tipo || (this.isVideoMedia(media.url) ? 'video' : 'imagen')
              })),
              videoUrl: project.videoUrl || ''
            }
          }))
        }));
      }
    });
  }

  private cargarVideos(): void {
    this.http.get<any[]>(this.videosApiUrl).subscribe({
      next: (videos) => {
        if (Array.isArray(videos)) {
          this.content.update((current) => ({
            ...current,
            videos: videos.map((v) => ({ src: v.src, caption: v.caption || v.titulo || '' }))
          }));
        }
      }
    });
  }

  isVideoMedia(url: string): boolean {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  }
}
