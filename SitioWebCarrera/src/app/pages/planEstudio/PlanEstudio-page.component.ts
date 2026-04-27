import { Component, computed, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { RouterModule } from '@angular/router';

type Subject = {
  name: string;
  credits: number;
  level: string;
};

type Semester = {
  subjects: Subject[];
};

type LevelInfo = {
  code: string;
  name: string;
  description: string;
};

const defaultContent = {
  text: {
    pageTitle: 'Plan de Estudios',
    pageDescription:
      'Conoce la estructura curricular de nuestro programa académico, diseñada para brindarte una formación integral y progresiva.',
    pdfLabel: 'Descargar Plan en PDF',
    optativasTitle: 'Materias Optativas',
    levelsTitle: 'Niveles de Formación',
    semesterLabel: 'Semestre',
    semesterSubjectsTitle: 'Materias del Semestre',
    optativasTab: 'Optativas',
    creditsLabel: 'créditos'
  },
  pdfUrl: 'assets/pdf/PlanEstudios.pdf',
  semesters: [] as Semester[],
  optativas: [] as Subject[],
  levels: [] as LevelInfo[],
  programInfo: {
    durationTitle: 'Duración del Programa',
    durationText: 'Duración total de 9 semestres (4.5 años).',
    modalityTitle: 'Modalidad',
    modalityText:
      'Modalidad presencial con actividades prácticas en laboratorios especializados y proyectos reales.'
  }
};

@Component({
  imports: [CommonModule, HttpClientModule, RouterModule],
  standalone: true,
  selector: 'planEstudios',
  templateUrl: './PlanEstudio-page.component.html',
  styleUrls: ['./PlanEstudio-page.component.css']
})
export class PlanEstudiosPageComponent {
  private translation = inject(TranslationService);

  readonly content = signal(defaultContent);

  constructor(private http: HttpClient) {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/plan-estudio.${fileLang}.json`)
        .subscribe((data) => {
          this.content.set(data as typeof defaultContent);
        });
    });
  }

  readonly pageTitle = computed(() => this.content().text.pageTitle);
  readonly pageDescription = computed(() => this.content().text.pageDescription);
  readonly pdfLabel = computed(() => this.content().text.pdfLabel);
  readonly optativasTitle = computed(() => this.content().text.optativasTitle);
  readonly levelsTitle = computed(() => this.content().text.levelsTitle);
  readonly pdfUrl = computed(() => this.content().pdfUrl);
  readonly semesters = computed<Semester[]>(() => this.content().semesters);
  readonly optativas = computed<Subject[]>(() => this.content().optativas);
  readonly levels = computed<LevelInfo[]>(() => this.content().levels);
  readonly programInfo = computed(() => this.content().programInfo);
}
