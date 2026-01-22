import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-shared',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-shared.component.html',
  styleUrls: ['./navbar-shared.component.css'],
})
export class NavbarSharedComponent {

  constructor(public router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
