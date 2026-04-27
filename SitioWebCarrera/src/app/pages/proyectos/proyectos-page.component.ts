import { Component, computed, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';

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
      image: 'assets/img/proy1.jpg',
      modal: {
        description:
          'Proyecto enfocado en el desarrollo de un carrito autï¿½f�,³nomo a escala utilizando Arduino y sensores ultrasï¿½f�,³nicos para la detecciï¿½f�,³n de obstï¿½f�,¡culos y toma de decisiones en tiempo real.',
        members: ['Ulises Diaz', 'Yahir Antonio', 'Fernando Gawalek'],
        gallery: [
          'assets/img/proy1.jpg',
          'assets/img/carrito1.jpg',
          'assets/img/carrito2.jpg'
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
      image: 'assets/img/proy2.jpeg',
      modal: {
        description:
          'Sistema de mediciï¿½f�,³n de presiï¿½f�,³n que permite visualizar datos en tiempo real mediante grï¿½f�,¡ficas dinï¿½f�,¡micas. El proyecto integra sensores electrï¿½f�,³nicos y software para el anï¿½f�,¡lisis de informaciï¿½f�,³n.',
        members: ['Carlos Mï¿½f�,©ndez', 'Marï¿½f�,­a Lï¿½f�,³pez', 'Fernando Ruiz'],
        gallery: ['assets/img/proy2.jpeg']
      }
    },
    {
      id: 3,
      categoryKey: 'sistemas',
      categoryLabel: 'Sistemas Inteligentes',
      title: 'Sensor de Detecciï¿½f�,³n de Personas',
      summary:
        'Sensor inteligente para detecciï¿½f�,³n automï¿½f�,¡tica de presencia humana.',
      image: 'assets/img/sensor.jpg',
      modal: {
        description:
          'Proyecto de sistemas inteligentes enfocado en la detecciï¿½f�,³n automï¿½f�,¡tica de presencia humana mediante sensores infrarrojos, aplicable a seguridad y control de accesos.',
        members: ['Andrea Torres', 'Juan Castillo', 'Diego Herrera'],
        gallery: ['assets/img/sensor.jpg']
      }
    },
    {
      id: 4,
      categoryKey: 'sistemas',
      categoryLabel: 'Sistemas Inteligentes',
      title: 'Dron Comandado por Voz',
      summary:
        'Dron inteligente programado para obedecer comandos por voz.',
      image: 'assets/img/proy4.png',
      modal: {
        description:
          'Dron inteligente programado para ejecutar acciones mediante comandos de voz. El sistema utiliza reconocimiento de voz y lï¿½f�,³gica de control para maniobras bï¿½f�,¡sicas de vuelo.',
        members: ['Pedro Sï¿½f�,¡nchez', 'Lucï¿½f�,­a Moreno', 'Daniel Cruz'],
        gallery: ['assets/img/proy4.png']
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
  imports: [CommonModule, HttpClientModule],
  templateUrl: './proyectos-page.component.html',
  styleUrls: ['./proyectos-page.component.css']
})

export class ProyectoPageComponent {
  public translation = inject(TranslationService);
  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/proyectos.${fileLang}.json`)
        .subscribe((data) => {
          this.content.set(data as typeof defaultContent);
          const keys = new Set(this.content().filters.map((f) => f.key));
          if (!keys.has(this.activeFilter())) {
            this.activeFilter.set('all');
          }
        });
    });
  }
  content = signal(defaultContent);

  activeFilter = signal<'all' | 'software' | 'sistemas'>('all');

  filteredProjects = computed(() => {
    const filterKey = this.activeFilter();
    const items = this.content().projects;
    if (filterKey === 'all') {
      return items;
    }
    return items.filter((project) => project.categoryKey === filterKey);
  });

  galleryImages = signal([
    // ï¿½f�,reas fï¿½f�,­sicas
    'assets/img/Electronica1.jpg',
    'assets/img/Elect.jpg',
    'assets/img/SalaRedes.jpg',
    'assets/img/Auditorio.jpg',
    'assets/img/Estatua.jpg',
    'assets/img/Electronica2.jpg',
    'assets/img/ConcursoAltar1.jpg',
    'assets/img/ConcursoAltar2.jpg',
    'assets/img/Viaje_EscNaval1.jpg',
    'assets/img/Viaje_EscNaval2.jpg',
    'assets/img/Viaje_EscNaval3.jpg',
    'assets/img/Viaje_Supercool.jpg',
    'assets/img/Viaje_Thyssenkrupp1.png',
    'assets/img/Viaje_Thyssenkrupp2.png',
    'assets/img/Viaje_Thyssenkrupp3.jpg',
    'assets/img/Viaje_Thyssenkrupp4.jpg',
    'assets/img/Viaje_UDLAP1.jpg',
    'assets/img/Viaje_UDLAP2.jpg',
    'assets/img/Viaje_UDLAP3.jpg',
    'assets/img/Viaje_UniVeracruz.jpg',
    'assets/img/Curso_2023.jpg'
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
}





