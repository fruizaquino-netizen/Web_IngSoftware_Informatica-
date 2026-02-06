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
      'Conoce la estructura curricular de nuestro programa acadï¿½fï¿½fï¿½,�,©mico, diseï¿½fï¿½fï¿½,�,±ada para brindarte una formaciï¿½fï¿½fï¿½,�,³n integral y progresiva.',
    pdfLabel: 'Descargar Plan en PDF',
    optativasTitle: 'Materias Optativas',
    levelsTitle: 'Niveles de Formaciï¿½fï¿½fï¿½,�,³n'
  },
  pdfUrl: 'assets/pdf/PlanEstudios.pdf',
  semesters: [
    {
      subjects: [
        { name: 'Metodologï¿½fï¿½fï¿½,�,­a de la Investigaciï¿½fï¿½fï¿½,�,³n', credits: 6, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Fundamentos Matemï¿½fï¿½fï¿½,�,¡ticos para la Ingenierï¿½fï¿½fï¿½,�,­a', credits: 7, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Lï¿½fï¿½fï¿½,�,³gica Matemï¿½fï¿½fï¿½,�,¡tica', credits: 7, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Programaciï¿½fï¿½fï¿½,�,³n I', credits: 4, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Fundamentos de Programaciï¿½fï¿½fï¿½,�,³n Estructurada', credits: 7, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Administraciï¿½fï¿½fï¿½,�,³n', credits: 5, level: 'Bï¿½fï¿½fï¿½,�,¡sico' }
      ]
    },
    {
      subjects: [
        { name: 'Fï¿½fï¿½fï¿½,�,­sica', credits: 6, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Cï¿½fï¿½fï¿½,�,¡lculo Diferencial e Integral', credits: 7, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Matemï¿½fï¿½fï¿½,�,¡ticas Discretas', credits: 7, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Teorï¿½fï¿½fï¿½,�,­a General de Sistemas', credits: 4, level: 'Bï¿½fï¿½fï¿½,�,¡sico' },
        { name: 'Estructura de Datos', credits: 7, level: 'Ascendente' },
        { name: 'Contabilidad y Finanzas', credits: 5, level: 'Bï¿½fï¿½fï¿½,�,¡sico' }
      ]
    },
    {
      subjects: [
        { name: 'Electrï¿½fï¿½fï¿½,�,³nica I', credits: 6, level: 'Ascendente' },
        { name: 'Teorï¿½fï¿½fï¿½,�,­a de Algoritmos y Complejidad', credits: 6, level: 'Ascendente' },
        { name: 'ï¿½fï¿½fï¿½,�,lgebra Lineal', credits: 6, level: 'Ascendente' },
        { name: 'Sistemas Operativos', credits: 6, level: 'Pavimentante' },
        { name: 'Paradigmas de Programaciï¿½fï¿½fï¿½,�,³n', credits: 7, level: 'Pavimentante' },
        { name: 'Liderazgo y Emprendimiento', credits: 5, level: 'Bï¿½fï¿½fï¿½,�,¡sico' }
      ]
    },
    {
      subjects: [
        { name: 'Electrï¿½fï¿½fï¿½,�,³nica II', credits: 6, level: 'Ascendente' },
        { name: 'Probabilidad y Estadï¿½fï¿½fï¿½,�,­stica', credits: 5, level: 'Ascendente' },
        { name: 'Mï¿½fï¿½fï¿½,�,©todos Numï¿½fï¿½fï¿½,�,©ricos', credits: 5, level: 'Ascendente' },
        { name: 'Redes de Computadoras', credits: 7, level: 'Pavimentante' },
        { name: 'Programaciï¿½fï¿½fï¿½,�,³n Orientada a Objetos', credits: 7, level: 'Pavimentante' },
        { name: 'Diseï¿½fï¿½fï¿½,�,±o de Bases de Datos', credits: 7, level: 'Pavimentante' }
      ]
    },
    {
      subjects: [
        { name: 'Arquitectura de Computadoras', credits: 5, level: 'Pavimentante' },
        { name: 'Modelos de Optimizaciï¿½fï¿½fï¿½,�,³n para Toma de Decisiones', credits: 5, level: 'Pavimentante' },
        { name: 'Ingenierï¿½fï¿½fï¿½,�,­a de Software I', credits: 7, level: 'Pavimentante' },
        { name: 'Servidores y Seguridad', credits: 7, level: 'Pavimentante' },
        { name: 'Sistemas Distribuidos', credits: 6, level: 'Pavimentante' },
        { name: 'Implementaciï¿½fï¿½fï¿½,�,³n de Bases de Datos', credits: 7, level: 'Pavimentante' }
      ]
    },
    {
      subjects: [
        { name: 'Derecho y Legislaciï¿½fï¿½fï¿½,�,³n Informï¿½fï¿½fï¿½,�,¡tica', credits: 4, level: 'Formativo' },
        { name: 'Desarrollo de Aplicaciones Web I', credits: 7, level: 'Pavimentante' },
        { name: 'Ingenierï¿½fï¿½fï¿½,�,­a de Software II', credits: 7, level: 'Pavimentante' },
        { name: 'Interfaz Humano Computadora', credits: 5, level: 'Formativo' },
        { name: 'Redes Inteligentes', credits: 6, level: 'Pavimentante' },
        { name: 'Bases de Datos Avanzadas', credits: 5, level: 'Pavimentante' }
      ]
    },
    {
      subjects: [
        { name: 'Proyectos de Tecnologï¿½fï¿½fï¿½,�,­as de Informaciï¿½fï¿½fï¿½,�,³n', credits: 5, level: 'Terminal' },
        { name: 'Desarrollo de Aplicaciones Web II', credits: 7, level: 'Terminal' },
        { name: 'Calidad de Software', credits: 6, level: 'Terminal' },
        { name: 'Fundamentos de Inteligencia Artificial', credits: 8, level: 'Terminal' },
        { name: 'Aprendizaje Automï¿½fï¿½fï¿½,�,¡tico', credits: 7, level: 'Terminal' },
        { name: 'Ciencia de Datos', credits: 6, level: 'Terminal' }
      ]
    },
    {
      subjects: [
        { name: 'Cï¿½fï¿½fï¿½,�,³mputo en la Nube', credits: 5, level: 'Terminal' },
        { name: 'Desarrollo de Soluciones Tecnolï¿½fï¿½fï¿½,�,³gicas', credits: 7, level: 'Terminal' },
        { name: 'Desarrollo de Sistemas Inteligentes', credits: 7, level: 'Terminal' },
        { name: 'Optativa I', credits: 6, level: 'Optativa' },
        { name: 'Optativa II', credits: 6, level: 'Optativa' }
      ]
    },
    {
      subjects: [
        { name: 'Seminario de Titulaciï¿½fï¿½fï¿½,�,³n', credits: 6, level: 'Terminal' },
        { name: 'Estancia Profesional', credits: 14, level: 'Terminal' }
      ]
    }
  ],
  optativas: [
    { name: 'Procesamiento de Lenguaje Natural', credits: 6, level: 'IA' },
    { name: 'Visiï¿½fï¿½fï¿½,�,³n Computacional', credits: 6, level: 'IA' },
    { name: 'Robï¿½fï¿½fï¿½,�,³tica', credits: 6, level: 'IA' },
    { name: 'Sistemas IoT', credits: 6, level: 'Hardware' },
    { name: 'Redes Avanzadas', credits: 6, level: 'TI' }
  ],
  levels: [
    { code: 'B', name: 'Bï¿½fï¿½fï¿½,�,¡sico', description: 'Fundamentos esenciales' },
    { code: 'A', name: 'Ascendente', description: 'Desarrollo intermedio' },
    { code: 'P', name: 'Pavimentante', description: 'Especializaciï¿½fï¿½fï¿½,�,³n avanzada' }
  ],
  programInfo: {
    durationTitle: 'Duraciï¿½fï¿½fï¿½,�,³n del Programa',
    durationText: 'Duraciï¿½fï¿½fï¿½,�,³n total de 9 semestres (4.5 aï¿½fï¿½fï¿½,�,±os).',
    modalityTitle: 'Modalidad',
    modalityText:
      'Modalidad presencial con actividades prï¿½fï¿½fï¿½,�,¡cticas en laboratorios especializados y proyectos reales.'
  }
};
@Component({
  imports: [CommonModule, HttpClientModule, RouterModule],
  standalone: true,
  selector:'planEstudios',
  templateUrl: './PlanEstudio-page.component.html',
  styleUrls: ['./PlanEstudio-page.component.css']
})
export class PlanEstudiosPageComponent{
  private translation = inject(TranslationService);
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
  readonly content = signal(defaultContent);

  readonly pageTitle = computed(() => this.content().text.pageTitle);
  readonly pageDescription = computed(() => this.content().text.pageDescription);
  readonly pdfLabel = computed(() => this.content().text.pdfLabel);
  readonly optativasTitle = computed(() => this.content().text.optativasTitle);
  readonly levelsTitle = computed(() => this.content().text.levelsTitle);
  readonly pdfUrl = computed(() => this.content().pdfUrl);
  readonly semesters = computed<Semester[]>(() => this.content().semesters);
  readonly optativas = computed<Subject[]>(() => this.content().optativas);
  readonly levels = computed<LevelInfo[]>(() => this.content().levels);
  readonly programInfo = computed(() => this.content().programInfo);}






