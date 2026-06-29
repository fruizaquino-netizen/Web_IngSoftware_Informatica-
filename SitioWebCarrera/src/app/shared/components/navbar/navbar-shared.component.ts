import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { parseJsonWithBom } from '../../json-helpers';
import { TranslationService } from '../../../services/translation.service';

const defaultContent = {
  NAVBAR: {
    HOME: 'Inicio',
    ABOUT: 'Conócenos',
    ABOUT_ABOUT: 'Quiénes Somos',
    ABOUT_PROFILES: 'Perfiles de la Carrera',
    ABOUT_TEACHERS: 'Docentes',
    ABOUT_TOUR: 'Recorrido Virtual',
    APPLICANTS: 'Aspirantes',
    APPLICANTS_PROCESS: 'Proceso de Admisión',
    APPLICANTS_REQUIREMENTS: 'Requisitos y Fechas',
    APPLICANTS_MORE_INFO: '¿Más información?',
    STUDENTS: 'Alumnos',
    STUDENTS_STUDY_PLAN: 'Plan de Estudios',
    STUDENTS_SCHEDULE: 'Horarios',
    STUDENTS_CALENDAR: 'Calendario Escolar',
    STUDENTS_PROJECTS: 'Proyectos',
    STUDENTS_GALLERY: 'Galería',
    GRADUATES: 'Egresados',
    GRADUATES_BY_YEAR: 'Egresados por Año',
    GRADUATES_BY_MODALITY: 'Titulados por Modalidad',
    LANGUAGE: 'Idioma',
    LANG_ES: 'Español',
    LANG_EN: 'English',
    LANG_ZAP: 'Zapoteco'
  }
};

type NavItem = {
  labelKey: keyof typeof defaultContent.NAVBAR;
  route?: string;
  href?: string;
  external?: boolean;
};

type NavGroup = {
  labelKey: keyof typeof defaultContent.NAVBAR;
  items: NavItem[];
};

@Component({
  selector: 'app-navbar-shared',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './navbar-shared.component.html',
  styleUrls: ['./navbar-shared.component.css']
})
export class NavbarSharedComponent {
  public service = inject(TranslationService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  content = signal(defaultContent);
  isScrolled = false;

  navGroups: NavGroup[] = [
    {
      labelKey: 'ABOUT',
      items: [
        { labelKey: 'ABOUT_ABOUT', route: '/quienesSomos' },
        { labelKey: 'ABOUT_PROFILES', route: '/perfil-carrera' },
        { labelKey: 'ABOUT_TEACHERS', route: '/docentes' },
        { labelKey: 'ABOUT_TOUR', route: '/recorrido-virtual' }
      ]
    },
    {
      labelKey: 'APPLICANTS',
      items: [
        { labelKey: 'APPLICANTS_PROCESS', route: '/proceso-admision' },
        { labelKey: 'APPLICANTS_REQUIREMENTS', route: '/requisitos-admision' },
        { labelKey: 'APPLICANTS_MORE_INFO', route: '/mas-informacion' }
      ]
    },
    {
      labelKey: 'STUDENTS',
      items: [
        { labelKey: 'STUDENTS_STUDY_PLAN', route: '/planEstudios' },
        { labelKey: 'STUDENTS_SCHEDULE', route: '/horarios' },
        { labelKey: 'STUDENTS_CALENDAR', route: '/calendario' },
        { labelKey: 'STUDENTS_PROJECTS', route: '/proyectos' },
        { labelKey: 'STUDENTS_GALLERY', route: '/galeria' }
      ]
    },
    {
      labelKey: 'GRADUATES',
      items: [
        { labelKey: 'GRADUATES_BY_YEAR', route: '/egresados-por-anio' },
        { labelKey: 'GRADUATES_BY_MODALITY', route: '/titulados-por-modalidad' }
      ]
    }
  ];

  constructor(private router: Router) {
    if (!this.isBrowser) {
      return;
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeNavbar());

    effect(() => {
      const lang = this.service.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/navbar.${fileLang}.json`, { responseType: 'text' })
        .subscribe((text) => {
          this.content.set(
            parseJsonWithBom<typeof defaultContent>(text, defaultContent, `navbar.${fileLang}.json`)
          );
        });
    });
  }

  cambiarIdioma(lang: 'es' | 'en' | 'zapoteco') {
    this.service.changeLanguage(lang);
  }

  getLangIconUrl(lang: 'es' | 'en' | 'zapoteco'): string {
    if (lang === 'en') return 'assets/img/eu.png';
    if (lang === 'zapoteco') return 'assets/img/lenguas.png';
    return 'assets/img/mx.png';
  }

  closeNavbar(): void {
    if (!this.isBrowser) {
      return;
    }

    const navbar = document.getElementById('navbarInstitucional');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  isHomeActive(): boolean {
    const currentRoute = this.router.url.split('?')[0];
    return (
      currentRoute === '/' ||
      currentRoute.includes('excelecia-academica') ||
      currentRoute.includes('tecnologia-avanzada') ||
      currentRoute.includes('vinculacion-regional')
    );
  }

  isGroupActive(group: NavGroup): boolean {
    return group.items.some((item) => this.isItemActive(item));
  }

  isItemActive(item: NavItem): boolean {
    const url = this.router.url.split('?')[0];
    const path = url.split('#')[0];

    if (item.route && path !== item.route) {
      return false;
    }

    return true;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) {
      return;
    }

    this.isScrolled = window.scrollY > 20;
  }
}
