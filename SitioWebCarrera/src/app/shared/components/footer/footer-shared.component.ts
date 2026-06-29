import { Component, effect, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../../services/translation.service';
import { parseJsonWithBom } from '../../json-helpers';

const defaultContent = {
  FOOTER: {
    FOLLOW: 'SÍGUENOS',
    COPYRIGHT: '© 2026 UNISTMO. Todos los derechos reservados.'
  }
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './footer-shared.component.html',
  styleUrls: ['./footer-shared.component.css']
})
export class FooterSharedComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  content = signal(defaultContent);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';

      this.http
        .get(`assets/i18n/footer.${fileLang}.json`, { responseType: 'text' })
        .subscribe({
          next: (text) => {
            this.content.set(
              parseJsonWithBom<typeof defaultContent>(text, defaultContent, `footer.${fileLang}.json`)
            );
          },
          error: (err) => {
            console.warn('No se pudo cargar el archivo de traduccion, usando fallback:', err);
            this.content.set(defaultContent);
          }
        });
    });
  }
}
