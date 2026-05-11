import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../../services/translation.service';

const defaultContent = {
  FOOTER: {
    // Mantuvimos solo lo necesario para el diseño minimalista
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

  // Inicializamos con el contenido por defecto
  content = signal(defaultContent);

  constructor() {
    effect(() => {
      // Detecta el cambio de idioma (es, en, zapoteco)
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';

      this.http
        .get(`assets/i18n/footer.${fileLang}.json`)
        .subscribe({
          next: (data) => {
            this.content.set(data as typeof defaultContent);
          },
          error: (err) => {
            console.warn('No se pudo cargar el archivo de traducción, usando fallback:', err);
            this.content.set(defaultContent);
          }
        });
    });
  }
}
