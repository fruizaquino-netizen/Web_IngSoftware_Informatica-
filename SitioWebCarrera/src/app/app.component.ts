import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from './services/translation.service';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatbotComponent],
  template: `
    <router-outlet></router-outlet>
    <app-chatbot></app-chatbot>
  `
})
export class AppComponent {
   constructor(public TranslationService: TranslationService) {
  this.TranslationService.changeLanguage('es');
}
}
