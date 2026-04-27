import { Component, signal, computed, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';

interface HeroInfo {
  titulo: string;
  subtitulo: string;
  descripcion: string;
}

interface InfoInstitucional {
  texto: string;
}

interface Stat {
  numero: string;
  texto: string;
}

interface TourStep {
  img: string;
  controls: {
    key:
      | 'START'
      | 'LEFT_ELECTRONICS'
      | 'RIGHT_BUILDING'
      | 'DOWN_BACK'
      | 'UP_FORWARD'
      | 'LEFT_ENTER'
      | 'DOWN_RETURN'
      | 'LEFT_BACK';
    target: number;
  }[];
}

const defaultContent = {
  QUIENES_SOMOS: {
    HERO: {
      TITLE: '¿Quiénes Somos?',
      SUBTITLE: 'Formamos líderes en el área de software y hardware',
      DESCRIPTION:
        'Profesionales capaces de diseñar, desarrollar e implementar soluciones tecnológicas innovadoras, gestionando proyectos de sistemas de información y participando en equipos multidisciplinarios. Cuentan con habilidades en programación, bases de datos, redes, desarrollo de software y aplicación de tecnologías emergentes para resolver problemáticas reales en organizaciones y en la sociedad.'
    },
    MISSION_TITLE: 'Nuestra Misión y Visión',
    MISSION_TEXTS: [
      'Formar profesionales líderes en el diseño, desarrollo y aplicación de sistemas inteligentes y de software, para satisfacer las necesidades en los sectores público y privado a nivel nacional e internacional, impulsando el desarrollo social mediante una educación integral y multidisciplinaria.',
      'Consolidarse como una carrera líder en la formación de profesionistas analíticos, con conocimientos sólidos en informática para el desarrollo de sistemas inteligentes y software, que aporten soluciones tecnológicas e innovadoras con reconocimiento nacional e internacional, que contribuyan a mejorar el entorno global e impacten positivamente en el desarrollo de la sociedad.'
    ],
    VALUES_TITLE: 'Valores Institucionales',
    VALUES: [
      'Disciplina y Respeto',
      'Responsabilidad y Tolerancia',
      'Lealtad y Honradez',
      'Honestidad y Solidaridad Social',
      'Excelencia académica',
      'Compromiso social',
      'Innovación y tecnología',
      'Desarrollo sostenible'
    ],
    STATS: [
      { NUMBER: '23+', TEXT: 'Años de experiencia' },
      { NUMBER: '863+', TEXT: 'Estudiantes activos' },
      { NUMBER: '228+', TEXT: 'Docentes calificados' },
      { NUMBER: '90%', TEXT: 'Tasa de empleabilidad' }
    ],
    CTA: {
      TITLE: 'Conoce el plan de estudios de nuestra carrera',
      DESCRIPTION:
        'Descubre nuestra oferta educativa en el área de tecnologías de la información, donde podrás formarte como profesional en Informática o como Ingeniero/a en Desarrollo de Software y Sistemas Inteligentes. Ambas carreras están diseñadas para brindarte competencias sólidas en programación, administración de sistemas, bases de datos, desarrollo web y móvil, así como el diseño e implementación de soluciones tecnológicas innovadoras que responden a las necesidades actuales de la industria y la sociedad.',
      BUTTON: 'Ver Plan de Estudios'
    },
    TOUR: {
      TITLE: 'Recorrido Virtual',
      ALT: 'Recorrido virtual',
      CONTROLS: {
        START: '▶ Iniciar recorrido',
        LEFT_ELECTRONICS: '⬅ Electrónica',
        RIGHT_BUILDING: '➡ Edificio',
        DOWN_BACK: '⬇ Atrás',
        UP_FORWARD: '⬆ Adelante',
        LEFT_ENTER: '⬅ Entrar',
        DOWN_RETURN: '⬇ Regresar',
        LEFT_BACK: '⬅ Atrás'
      }
    }
  }
};

@Component({
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  selector: 'quienes-somos-page',
  templateUrl: './quienesSomos-page.component.html',
  styleUrls: ['./quienesSomos-page.component.css']
})
export class QuienesSomosPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);

  content = signal(defaultContent);

  public hero = computed<HeroInfo>(() => ({
    titulo: this.content().QUIENES_SOMOS.HERO.TITLE,
    subtitulo: this.content().QUIENES_SOMOS.HERO.SUBTITLE,
    descripcion: this.content().QUIENES_SOMOS.HERO.DESCRIPTION
  }));

  public infoInstitucional = computed<InfoInstitucional[]>(() =>
    this.content().QUIENES_SOMOS.MISSION_TEXTS.map((texto) => ({ texto }))
  );

  public valores = computed<string[]>(
    () => this.content().QUIENES_SOMOS.VALUES
  );

  public stats = computed<Stat[]>(() =>
    this.content().QUIENES_SOMOS.STATS.map((stat) => ({
      numero: stat.NUMBER,
      texto: stat.TEXT
    }))
  );

  public cta = computed(() => ({
    titulo: this.content().QUIENES_SOMOS.CTA.TITLE,
    descripcion: this.content().QUIENES_SOMOS.CTA.DESCRIPTION
  }));

  currentStep = signal<number>(0);

  tour = signal<TourStep[]>([
    {
      img: 'assets/img/recorrido/1.ImagenUnistmo.JPG',
      controls: [
        { key: 'START', target: 1 }
      ]
    },
    {
      img: 'assets/img/recorrido/2.Pasillo_principal.jpeg',
      controls: [
        { key: 'LEFT_ELECTRONICS', target: 2 },
        { key: 'RIGHT_BUILDING', target: 7 }
      ]
    },
    {
      img: 'assets/img/recorrido/3.Pasillo_Electronica1.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 1 },
        { key: 'UP_FORWARD', target: 3 }
      ]
    },
    {
      img: 'assets/img/recorrido/4.Pasillo_Electronica2.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 2 },
        { key: 'UP_FORWARD', target: 4 }
      ]
    },
    {
      img: 'assets/img/recorrido/5.Sala_Electronica.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 3 },
        { key: 'UP_FORWARD', target: 5 }
      ]
    },
    {
      img: 'assets/img/recorrido/6.Int_Electronica1.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 4 },
        { key: 'UP_FORWARD', target: 6 }
      ]
    },
    {
      img: 'assets/img/recorrido/7.Int_Electronica2.jpeg',
      controls: [
        { key: 'DOWN_RETURN', target: 4 }
      ]
    },
    {
      img: 'assets/img/recorrido/8.Pasillo_Edificio1.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 1 },
        { key: 'UP_FORWARD', target: 8 }
      ]
    },
    {
      img: 'assets/img/recorrido/9.Pasillo_Edificio2.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 7 },
        { key: 'UP_FORWARD', target: 9 }
      ]
    },
    {
      img: 'assets/img/recorrido/10.Sala_Computo3.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 9 },
        { key: 'LEFT_ENTER', target: 10 },
        { key: 'UP_FORWARD', target: 12 }
      ]
    },
    {
      img: 'assets/img/recorrido/11.Int_Computo1.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 9 },
        { key: 'UP_FORWARD', target: 11 }
      ]
    },
    {
      img: 'assets/img/recorrido/12.Int_Computo2.jpeg',
      controls: [
        { key: 'DOWN_RETURN', target: 9 }
      ]
    },
    {
      img: 'assets/img/recorrido/13.Escaleras1.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 9 },
        { key: 'UP_FORWARD', target: 13 }
      ]
    },
    {
      img: 'assets/img/recorrido/14.Escaleras2.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 12 },
        { key: 'UP_FORWARD', target: 14 }
      ]
    },
    {
      img: 'assets/img/recorrido/15.Sala_Redes.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 13 },
        { key: 'LEFT_ENTER', target: 15 },
        { key: 'UP_FORWARD', target: 17 }
      ]
    },
    {
      img: 'assets/img/recorrido/16.Int_Redes1.jpeg',
      controls: [
        { key: 'LEFT_BACK', target: 14 },
        { key: 'UP_FORWARD', target: 16 }
      ]
    },
    {
      img: 'assets/img/recorrido/17.Int_Redes2.jpeg',
      controls: [
        { key: 'DOWN_RETURN', target: 14 }
      ]
    },
    {
      img: 'assets/img/recorrido/18.PasilloSuperior.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 14 },
        { key: 'UP_FORWARD', target: 18 }
      ]
    },
    {
      img: 'assets/img/recorrido/19.Sala_Desarrollo.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 17 },
        { key: 'UP_FORWARD', target: 19 }
      ]
    },
    {
      img: 'assets/img/recorrido/20.Int_Desarrollo1.jpeg',
      controls: [
        { key: 'DOWN_BACK', target: 18 },
        { key: 'UP_FORWARD', target: 20 }
      ]
    },
    {
      img: 'assets/img/recorrido/21.Int_Desarrollo2.jpeg',
      controls: [
        { key: 'DOWN_RETURN', target: 19 }
      ]
    }
  ]);

  constructor() {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/quienes-somos.${fileLang}.json`)
        .subscribe((data) => {
          this.content.set(data as typeof defaultContent);
        });
    });
  }

  goTo(step: number) {
    if (step >= 0 && step < this.tour().length) {
      this.currentStep.set(step);
    }
  }
}
