import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

const defaultContent = {
  ASPIRANTES: {
    CTA_TITLE: '¿Necesitas más información?',
    CTA_TEXT: 'Nuestro equipo de atención a aspirantes está listo para resolver todas tus dudas sobre el proceso de admisión.',
    CTA_CONTACT: 'Contactar Admisiones',
    CTA_GUIDE: 'Ver Requisitos'
  }
};

@Component({
  selector: 'app-mas-informacion-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './mas-informacion-page.component.html',
  styleUrl: './mas-informacion-page.component.css'
})
export class MasInformacionPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);

  content = signal(defaultContent);

  constructor() {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/aspirantes.${fileLang}.json`, { responseType: 'text' })
        .subscribe((text) => {
          const parsed = parseJsonWithBom<any>(text, defaultContent, `aspirantes.${fileLang}.json`);
          this.content.set({
            ASPIRANTES: {
              ...defaultContent.ASPIRANTES,
              ...(parsed.ASPIRANTES || {})
            }
          });
        });
    });
  }
}
