import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarSharedComponent} from './shared/components/navbar/navbar-shared.component'
import {FooterSharedComponent} from './shared/components/footer/footer-shared.component'


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarSharedComponent, FooterSharedComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SitioWebCarrera');
}
