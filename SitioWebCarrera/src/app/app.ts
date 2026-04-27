import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarSharedComponent } from './shared/components/navbar/navbar-shared.component';
import { FooterSharedComponent } from './shared/components/footer/footer-shared.component';
import { HeaderSharedComponent } from './shared/components/header/header-shared.component';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarSharedComponent,
    FooterSharedComponent,
    HeaderSharedComponent,
    ChatbotComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal(
    'In.En Desarrollo de Software y Sistemas Inteligentes-Informï¿½f�,¡tica'
  );
}
