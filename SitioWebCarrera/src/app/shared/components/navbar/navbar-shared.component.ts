import { Component, HostListener, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-shared',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-shared.component.html',
  styleUrls: ['./navbar-shared.component.css']
})
export class NavbarSharedComponent implements OnInit, OnDestroy {

  translateService = inject(TranslateService);
  private langSub!: Subscription;

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
  }

  ngOnInit() {
    this.langSub = this.translateService.langChanged$.subscribe(() => {});
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }

  cambiarIdioma(lang: string) {
    this.translateService.changeLanguage(lang);
  }

  idiomaActual(): string {
    return this.translateService.getCurrentLang();
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
