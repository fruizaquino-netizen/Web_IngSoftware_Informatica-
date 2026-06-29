import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

const defaultContent = {
  ASPIRANTES: {
    PROCESS_TITLE: 'Proceso de Admisión',
    INTRO: 'Inicia tu camino hacia la excelencia profesional. Conoce el proceso de admisión para formar parte de nuestra comunidad universitaria.',
    STEPS: [
      {
        NUMBER: 'Paso 1',
        TITLE: 'Solicita tu Ficha',
        TEXT: 'Completa el formulario de registro en línea y obtén tu ficha de admisión.'
      },
      {
        NUMBER: 'Paso 2',
        TITLE: 'Presenta tu Examen',
        TEXT: 'Realiza el examen de admisión en la fecha y hora asignadas.'
      },
      {
        NUMBER: 'Paso 3',
        TITLE: 'Inscríbete',
        TEXT: 'Si apruebas, completa tu inscripción y comienza tu carrera universitaria.'
      }
    ],
    REGISTER_BUTTON: 'Iniciar registro'
  }
};

@Component({
  selector: 'app-proceso-admision-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './proceso-admision-page.component.html',
  styleUrl: './proceso-admision-page.component.css'
})
export class ProcesoAdmisionPageComponent {
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
