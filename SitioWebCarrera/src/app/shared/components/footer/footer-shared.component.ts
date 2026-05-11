import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../../services/translation.service';

const defaultContent = {
  FOOTER: {
    TITLE: 'Carrera de Informática',
    DOWNLOADS: 'Zona de Descargas',
    FORMS: 'Formularios',
    RULES: 'Reglamentos',
    DOCUMENTS: 'Documentos',
    RESOURCES_TITLE: 'Recursos Académicos',
    ONLINE_FORMS: 'Formularios en línea',
    STUDENT_RULES: 'Reglamento estudiantil',
    ACADEMIC_DOCS: 'Documentos académicos',
    FOLLOW: 'Redes Oficiales',
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

  content = signal(defaultContent);

  constructor() {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';

      this.http
        .get(`assets/i18n/footer.${fileLang}.json`)
        .subscribe({
          next: (data) => this.content.set(data as typeof defaultContent),
          error: () => this.content.set(defaultContent) // Fallback por seguridad
        });
    });
  }
}
