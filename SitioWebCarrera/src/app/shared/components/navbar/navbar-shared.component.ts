import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-shared',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-shared.component.html',
  styleUrls: ['./navbar-shared.component.css'],
})
export class NavbarSharedComponent {

  isScrolled = false;

  constructor(public router: Router) {}

  isActive(path: string): boolean {
    const currentRoute = this.router.url;

    // Lógica especial para el botón de INICIO
    if (path === '/') {
      return (
        currentRoute === '/' ||
        currentRoute.includes('excelecia-academica') ||
        currentRoute.includes('tecnologia-avanzada') ||
        currentRoute.includes('vinculacion-regional')
      );
    }

    // Para el resto de los botones (Docentes, Proyectos, etc.)
    return currentRoute === path;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }
}
