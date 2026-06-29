import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

const defaultContent = {
  QUIENES_SOMOS: {
    PROFILES: {
      TITLE: 'Perfiles de la Carrera',
      ENTRY_TITLE: 'Perfil de Ingreso',
      ENTRY_ITEMS: [
        'Interés por la tecnología, la programación y la solución de problemas.',
        'Habilidad para el razonamiento lógico y matemático.',
        'Disposición para el aprendizaje autónomo y el trabajo colaborativo.',
        'Actitud responsable, creativa y comprometida con su entorno.'
      ],
      GRADUATE_TITLE: 'Perfil de Egreso',
      GRADUATE_TEXTS: [
        'Los egresados y egresadas de la carrera de Ingeniería en Desarrollo de Software y Sistemas Inteligentes serán profesionales altamente capacitados para enfrentar los desafíos tecnológicos del siglo XXI.',
        'Su formación integral les permitirá diseñar, desarrollar, implementar y mantener soluciones de software y sistemas inteligentes que respondan a las necesidades actuales y futuras de la sociedad e industria.',
        'Las competencias y habilidades adquiridas durante su formación los posicionan como agentes de cambio y líderes en innovación tecnológica.',
        'A lo largo de su formación académica, los egresados y egresadas adquirirán aptitudes y valores que les permitirán conducirse como agentes de cambio en diferentes contextos con principios éticos y morales al ejercer su profesión.'
      ]
    }
  }
};

@Component({
  selector: 'app-perfiles-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './perfiles-page.component.html',
  styleUrl: './perfiles-page.component.css'
})
export class PerfilesPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);

  content = signal(defaultContent);

  constructor() {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/quienes-somos.${fileLang}.json`, { responseType: 'text' })
        .subscribe((text) => {
          const parsed = parseJsonWithBom<any>(text, defaultContent, `quienes-somos.${fileLang}.json`);
          this.content.set({
            QUIENES_SOMOS: {
              PROFILES: {
                ...defaultContent.QUIENES_SOMOS.PROFILES,
                ...(parsed.QUIENES_SOMOS?.PROFILES || {})
              }
            }
          });
        });
    });
  }
}
