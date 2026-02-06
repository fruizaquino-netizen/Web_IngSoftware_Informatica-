import { Component, HostListener, inject, effect, signal } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  content = signal(defaultContent);

  cambiarIdioma(lang: 'es' | 'en' | 'zapoteco') {
    this.service.changeLanguage(lang);
  }

  getLangIconUrl(lang: 'es' | 'en' | 'zapoteco'): string {
    if (lang === 'en') return 'assets/img/eu.png';
    if (lang === 'zapoteco') return 'assets/img/lenguas.png';
    return 'assets/img/mx.png';
  }

  isScrolled = false;

  constructor(private router: Router) {
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
        .get(`assets/i18n/navbar.${fileLang}.json`)
        .subscribe((data) => {
          this.content.set(data as typeof defaultContent);
        });
    });
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
    this.isScrolled = window.scrollY > 20;
  }
}
