import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
   constructor(private translate: TranslateService) {
  this.translate.changeLanguage('español');
}
}
