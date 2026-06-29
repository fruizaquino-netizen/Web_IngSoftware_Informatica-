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
    projectsDescription:
      'Conoce los proyectos de investigaciï¿½f�,³n y desarrollo tecnolï¿½f�,³gico realizados por nuestros estudiantes y docentes.',
    galleryTitle: 'Galerï¿½f�,­a',
    videosTitle: 'Videos',
    imagesTitle: 'Imï¿½f�,¡genes',
    watchMore: 'Ver Mï¿½f�,¡s',
    close: 'Cerrar',
    members: 'Integrantes',
    gallery: 'Galerï¿½f�,­a',
    video: 'Video',
    videoFallback: 'Tu navegador no soporta videos HTML5.'
  },
  filters: [
    { id: 'filter-all', key: 'all', label: 'Todos' },
    { id: 'filter-software', key: 'software', label: 'Desarrollo de Software' },
    { id: 'filter-sistemas', key: 'sistemas', label: 'Sistemas Inteligentes' }
  ],
  projects: [
    {
      id: 1,
      categoryKey: 'software',
      categoryLabel: 'Desarrollo de Software',
      title: 'Carrito Autï¿½f�,³nomo con Arduino',
      summary:
        'Vehï¿½f�,­culo autï¿½f�,³nomo a escala controlado por Arduino con sensores inteligentes.',
      image: 'assets/img/Proyectos/proy1.jpg',
      modal: {
        description:
          'Proyecto enfocado en el desarrollo de un carrito autï¿½f�,³nomo a escala utilizando Arduino y sensores ultrasï¿½f�,³nicos para la detecciï¿½f�,³n de obstï¿½f�,¡culos y toma de decisiones en tiempo real.',
        members: ['Ulises Diaz', 'Yahir Antonio', 'Fernando Gawalek'],
        gallery: [
          'assets/img/Proyectos/proy1.jpg',
          'assets/img/Proyectos/carrito1.jpg',
          'assets/img/Proyectos/carrito2.jpg'
        ],
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID'
      }
    },
    {
      id: 2,
      categoryKey: 'software',
      categoryLabel: 'Desarrollo de Software',
      title: 'Medidor de Presiï¿½f�,³n con Grï¿½f�,¡ficas',
      summary:
        'Sistema de mediciï¿½f�,³n con visualizaciï¿½f�,³n grï¿½f�,¡fica en tiempo real.',
      image: 'assets/img/Proyectos/proy2.jpeg',
      modal: {
        description:
          'Sistema de mediciï¿½f�,³n de presiï¿½f�,³n que permite visualizar datos en tiempo real mediante grï¿½f�,¡ficas dinï¿½f�,¡micas. El proyecto integra sensores electrï¿½f�,³nicos y software para el anï¿½f�,¡lisis de informaciï¿½f�,³n.',
        members: ['Carlos Mï¿½f�,©ndez', 'Marï¿½f�,­a Lï¿½f�,³pez', 'Fernando Ruiz'],
        gallery: ['assets/img/Proyectos/proy2.jpeg']
      }
    },
    {
      id: 3,
      categoryKey: 'sistemas',
      categoryLabel: 'Sistemas Inteligentes',
      title: 'Sensor de Detecciï¿½f�,³n de Personas',
      summary:
        'Sensor inteligente para detecciï¿½f�,³n automï¿½f�,¡tica de presencia humana.',
      image: 'assets/img/Proyectos/sensor.jpg',
      modal: {
        description:
          'Proyecto de sistemas inteligentes enfocado en la detecciï¿½f�,³n automï¿½f�,¡tica de presencia humana mediante sensores infrarrojos, aplicable a seguridad y control de accesos.',
        members: ['Andrea Torres', 'Juan Castillo', 'Diego Herrera'],
        gallery: ['assets/img/Proyectos/sensor.jpg']
      }
    },
    {
      id: 4,
      categoryKey: 'sistemas',
      categoryLabel: 'Sistemas Inteligentes',
      title: 'Dron Comandado por Voz',
      summary:
        'Dron inteligente programado para obedecer comandos por voz.',
      image: 'assets/img/Proyectos/proy4.png',
      modal: {
        description:
          'Dron inteligente programado para ejecutar acciones mediante comandos de voz. El sistema utiliza reconocimiento de voz y lï¿½f�,³gica de control para maniobras bï¿½f�,¡sicas de vuelo.',
        members: ['Pedro Sï¿½f�,¡nchez', 'Lucï¿½f�,­a Moreno', 'Daniel Cruz'],
        gallery: ['assets/img/Proyectos/proy4.png']
      }
    }
  ],
  videos: [
    {
      src: 'assets/videos/IDDSI.mp4',
      caption: 'Presentaciï¿½f�,³n de la carrera IDSSI.'
    },
    {
      src: 'assets/videos/LicInf_Fer.mp4',
      caption: 'Promocion general de la carrera de Informï¿½f�,¡tica.'
    }
  ]
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
  private readonly galeriaApiUrl = 'http://localhost:3000/api/galeria';
  private readonly videosApiUrl = 'http://localhost:3000/api/videos';
  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.content.update((current) => ({
      ...current,
      projects: [],
      videos: []
    }));
    this.galleryImages.set([]);

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
          this.cargarGaleria();
          this.cargarVideos();
        });
    });
  }
  content = signal<any>(defaultContent);

  activeFilter = signal<'all' | 'software' | 'sistemas'>('all');

  filteredProjects = computed(() => {
    const filterKey = this.activeFilter();
    const items = this.content().projects;
    if (filterKey === 'all') {
      return items;
    }
    return items.filter((project: { categoryKey: string }) => project.categoryKey === filterKey);
  });

  galleryImages = signal([
    // ï¿½f�,reas fï¿½f�,­sicas
    'assets/img/Galeria/Electronica1.jpg',
    'assets/img/Galeria/Elect.jpg',
    'assets/img/Galeria/SalaRedes.jpg',
    'assets/img/Galeria/Auditorio.jpg',
    'assets/img/Galeria/Estatua.jpg',
    'assets/img/Galeria/Electronica2.jpg',
    'assets/img/Galeria/ConcursoAltar1.jpg',
    'assets/img/Galeria/ConcursoAltar2.jpg',
    'assets/img/Galeria/Viaje_EscNaval1.jpg',
    'assets/img/Galeria/Viaje_EscNaval2.jpg',
    'assets/img/Galeria/Viaje_EscNaval3.jpg',
    'assets/img/Galeria/Viaje_Supercool.jpg',
    'assets/img/Galeria/Viaje_Thyssenkrupp1.png',
    'assets/img/Galeria/Viaje_Thyssenkrupp2.png',
    'assets/img/Galeria/Viaje_Thyssenkrupp3.jpg',
    'assets/img/Galeria/Viaje_Thyssenkrupp4.jpg',
    'assets/img/Galeria/Viaje_UDLAP1.jpg',
    'assets/img/Galeria/Viaje_UDLAP2.jpg',
    'assets/img/Galeria/Viaje_UDLAP3.jpg',
    'assets/img/Galeria/Viaje_UniVeracruz.jpg',
    'assets/img/Galeria/Curso_2023.jpg'
  ]);

  activeImage = signal(0);
  galleryOpen = signal(false);

  openGallery(index: number) {
    this.activeImage.set(index);
    this.galleryOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeGallery() {
    this.galleryOpen.set(false);
    document.body.style.overflow = '';
  }

  next() {
    this.activeImage.update(
      (value) => (value + 1) % this.galleryImages().length
    );
  }

  prev() {
    this.activeImage.update(
      (value) =>
        (value - 1 + this.galleryImages().length) %
        this.galleryImages().length
    );
  }

  safeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setActiveFilter(key: 'all' | 'software' | 'sistemas') {
    this.activeFilter.set(key);
  }

  private cargarProyectos(): void {
    this.http
      .get<Array<{
        id: string;
        categoryKey: 'software' | 'sistemas';
        categoryLabel: string;
        title: string;
        summary: string;
        image: string;
        description: string;
        videoUrl?: string | null;
        miembros?: Array<{ nombre: string }>;
        galeria?: Array<{ url: string; tipo?: 'imagen' | 'video' }>;
      }>>(this.proyectosApiUrl)
      .subscribe({
        next: (projects) => {
          if (!Array.isArray(projects)) {
            return;
          }

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
                members: (project.miembros || []).map((miembro) => miembro.nombre),
                gallery: (project.galeria || []).map((media) => ({
                  url: media.url,
                  tipo: media.tipo || (this.isVideoMedia(media.url) ? 'video' : 'imagen')
                })),
                videoUrl: project.videoUrl || ''
              }
            }))
          }));
        },
        error: (error) => {
          console.error('Error al cargar proyectos desde la API:', error);
          this.content.update((current) => ({
            ...current,
            projects: []
          }));
        }
      });
  }

  private cargarGaleria(): void {
    this.http
      .get<Array<{ url: string }>>(this.galeriaApiUrl)
      .subscribe({
        next: (items) => {
          if (Array.isArray(items)) {
            this.galleryImages.set(items.map((item) => item.url));
          }
        },
        error: (error) => {
          console.error('Error al cargar galeria desde la API:', error);
          this.galleryImages.set([]);
        }
      });
  }

  private cargarVideos(): void {
    this.http
      .get<Array<{ src: string; caption?: string; titulo?: string }>>(this.videosApiUrl)
      .subscribe({
        next: (videos) => {
          if (Array.isArray(videos)) {
            this.content.update((current) => ({
              ...current,
              videos: videos.map((video) => ({
                src: video.src,
                caption: video.caption || video.titulo || ''
              }))
            }));
          }
        },
        error: (error) => {
          console.error('Error al cargar videos desde la API:', error);
          this.content.update((current) => ({
            ...current,
            videos: []
          }));
        }
      });
  }

  isVideoMedia(url: string): boolean {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  }
}





