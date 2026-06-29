import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { parseJsonWithBom } from '../../shared/json-helpers';

type TourControlKey =
  | 'START'
  | 'LEFT_ELECTRONICS'
  | 'RIGHT_BUILDING'
  | 'DOWN_BACK'
  | 'UP_FORWARD'
  | 'LEFT_ENTER'
  | 'DOWN_RETURN'
  | 'LEFT_BACK';

interface TourStep {
  img: string;
  controls: { key: TourControlKey; target: number }[];
}

const defaultContent = {
  QUIENES_SOMOS: {
    TOUR: {
      TITLE: 'Recorrido Virtual',
      ALT: 'Recorrido virtual',
      CONTROLS: {
        START: 'Iniciar recorrido',
        LEFT_ELECTRONICS: 'Electrónica',
        RIGHT_BUILDING: 'Edificio',
        DOWN_BACK: 'Atrás',
        UP_FORWARD: 'Adelante',
        LEFT_ENTER: 'Entrar',
        DOWN_RETURN: 'Regresar',
        LEFT_BACK: 'Atrás'
      }
    }
  }
};

@Component({
  selector: 'app-recorrido-virtual-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './recorrido-virtual-page.component.html',
  styleUrl: './recorrido-virtual-page.component.css'
})
export class RecorridoVirtualPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);

  content = signal(defaultContent);
  currentStep = signal(0);

  tour = signal<TourStep[]>([
    { img: 'assets/img/recorrido/1.ImagenUnistmo.JPG', controls: [{ key: 'START', target: 1 }] },
    { img: 'assets/img/recorrido/2.Pasillo_principal.jpeg', controls: [{ key: 'LEFT_ELECTRONICS', target: 2 }, { key: 'RIGHT_BUILDING', target: 7 }] },
    { img: 'assets/img/recorrido/3.Pasillo_Electronica1.jpeg', controls: [{ key: 'DOWN_BACK', target: 1 }, { key: 'UP_FORWARD', target: 3 }] },
    { img: 'assets/img/recorrido/4.Pasillo_Electronica2.jpeg', controls: [{ key: 'DOWN_BACK', target: 2 }, { key: 'UP_FORWARD', target: 4 }] },
    { img: 'assets/img/recorrido/5.Sala_Electronica.jpeg', controls: [{ key: 'DOWN_BACK', target: 3 }, { key: 'UP_FORWARD', target: 5 }] },
    { img: 'assets/img/recorrido/6.Int_Electronica1.jpeg', controls: [{ key: 'DOWN_BACK', target: 4 }, { key: 'UP_FORWARD', target: 6 }] },
    { img: 'assets/img/recorrido/7.Int_Electronica2.jpeg', controls: [{ key: 'DOWN_RETURN', target: 4 }] },
    { img: 'assets/img/recorrido/8.Pasillo_Edificio1.jpeg', controls: [{ key: 'DOWN_BACK', target: 1 }, { key: 'UP_FORWARD', target: 8 }] },
    { img: 'assets/img/recorrido/9.Pasillo_Edificio2.jpeg', controls: [{ key: 'DOWN_BACK', target: 7 }, { key: 'UP_FORWARD', target: 9 }] },
    { img: 'assets/img/recorrido/10.Sala_Computo3.jpeg', controls: [{ key: 'DOWN_BACK', target: 9 }, { key: 'LEFT_ENTER', target: 10 }, { key: 'UP_FORWARD', target: 12 }] },
    { img: 'assets/img/recorrido/11.Int_Computo1.jpeg', controls: [{ key: 'DOWN_BACK', target: 9 }, { key: 'UP_FORWARD', target: 11 }] },
    { img: 'assets/img/recorrido/12.Int_Computo2.jpeg', controls: [{ key: 'DOWN_RETURN', target: 9 }] },
    { img: 'assets/img/recorrido/13.Escaleras1.jpeg', controls: [{ key: 'DOWN_BACK', target: 9 }, { key: 'UP_FORWARD', target: 13 }] },
    { img: 'assets/img/recorrido/14.Escaleras2.jpeg', controls: [{ key: 'DOWN_BACK', target: 12 }, { key: 'UP_FORWARD', target: 14 }] },
    { img: 'assets/img/recorrido/15.Sala_Redes.jpeg', controls: [{ key: 'DOWN_BACK', target: 13 }, { key: 'LEFT_ENTER', target: 15 }, { key: 'UP_FORWARD', target: 17 }] },
    { img: 'assets/img/recorrido/16.Int_Redes1.jpeg', controls: [{ key: 'LEFT_BACK', target: 14 }, { key: 'UP_FORWARD', target: 16 }] },
    { img: 'assets/img/recorrido/17.Int_Redes2.jpeg', controls: [{ key: 'DOWN_RETURN', target: 14 }] },
    { img: 'assets/img/recorrido/18.PasilloSuperior.jpeg', controls: [{ key: 'DOWN_BACK', target: 14 }, { key: 'UP_FORWARD', target: 18 }] },
    { img: 'assets/img/recorrido/19.Sala_Desarrollo.jpeg', controls: [{ key: 'DOWN_BACK', target: 17 }, { key: 'UP_FORWARD', target: 19 }] },
    { img: 'assets/img/recorrido/20.Int_Desarrollo1.jpeg', controls: [{ key: 'DOWN_BACK', target: 18 }, { key: 'UP_FORWARD', target: 20 }] },
    { img: 'assets/img/recorrido/21.Int_Desarrollo2.jpeg', controls: [{ key: 'DOWN_RETURN', target: 19 }] }
  ]);

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
              TOUR: {
                ...defaultContent.QUIENES_SOMOS.TOUR,
                ...(parsed.QUIENES_SOMOS?.TOUR || {})
              }
            }
          });
        });
    });
  }

  goTo(step: number) {
    if (step >= 0 && step < this.tour().length) {
      this.currentStep.set(step);
    }
  }
}
