import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

const defaultContent = {
  ASPIRANTES: {
    REQUIREMENTS_TITLE: 'Requisitos de Admisión',
    DATES_TITLE: 'Fechas Importantes',
    REQUIREMENTS: [
      'Certificado de bachillerato o constancia de estudios',
      'Acta de nacimiento (original y copia)',
      'CURP (original y copia)',
      '6 fotografías tamaño infantil',
      'Comprobante de domicilio'
    ],
    DATES: [
      { LABEL: 'Registro en Línea', VALUE: 'Enero - Junio 2026' },
      { LABEL: 'Examen de Admisión', VALUE: '15 de Julio 2026' },
      { LABEL: 'Publicación de Resultados', VALUE: '25 de Julio 2026' },
      { LABEL: 'Inscripciones', VALUE: '1 - 15 de Agosto 2026' }
    ],
    CTA_GUIDE: 'Ver Requisitos'
  }
};

@Component({
  selector: 'app-requisitos-admision-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './requisitos-admision-page.component.html',
  styleUrl: './requisitos-admision-page.component.css'
})
export class RequisitosAdmisionPageComponent {
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
