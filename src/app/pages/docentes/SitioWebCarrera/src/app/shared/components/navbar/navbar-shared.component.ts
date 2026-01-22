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
    return this.router.url === path;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }
}
