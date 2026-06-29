import { Component, HostListener, inject, effect, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslationService } from '../../../services/translation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { parseJsonWithBom } from '../../json-helpers';

const defaultContent = {
  NAVBAR: {
    HOME: 'Inicio',
    ABOUT: '¿Quiénes Somos?',
    STUDY_PLAN: 'Plan de Estudios',
    PROJECTS: 'Proyectos',
    TEACHERS: 'Docentes',
    APPLICANTS: 'Aspirantes',
    GRADUATES: 'Egresados',
    LANGUAGE: 'Idioma',
    LANG_ES: 'Español',
    LANG_EN: 'English',
    LANG_ZAP: 'Zapoteco'
  }
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

  constructor(private router: Router) {
    if (!this.isBrowser) {
      return;
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const navbar = document.getElementById('navbarContenido');
        if (navbar?.classList.contains('show')) {
          navbar.classList.remove('show');
        }
      });

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

  isActive(path: string): boolean {
    const currentRoute = this.router.url;

    if (path === '/') {
      return (
        currentRoute === '/' ||
        currentRoute.includes('excelecia-academica') ||
        currentRoute.includes('tecnologia-avanzada') ||
        currentRoute.includes('vinculacion-regional')
      );
    }

    return currentRoute === path;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) {
      return;
    }

    this.isScrolled = window.scrollY > 20;
  }
}
