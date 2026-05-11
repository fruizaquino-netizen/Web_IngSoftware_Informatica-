import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollTopComponent } from './shared/scroll-top/scroll-top.component';

import { TranslationService } from './services/translation.service';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatbotComponent, ScrollTopComponent],
  template: `
    <router-outlet></router-outlet>
    <app-chatbot></app-chatbot>
    <app-scroll-top></app-scroll-top>
  `
})
export class AppComponent {

  constructor(public TranslationService: TranslationService) {
    this.TranslationService.changeLanguage('es');
  }

}
