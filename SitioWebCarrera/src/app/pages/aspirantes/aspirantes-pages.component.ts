import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';

const defaultContent = {
  ASPIRANTES: {
    TICKER_LABEL: 'TESTIMONIOS',
    TITLE: 'Aspirantes',
    INTRO:
      'Inicia tu camino hacia la excelencia profesional. Conoce el proceso de admisión y los requisitos para formar parte de nuestra comunidad universitaria.',
    PROCESS_TITLE: 'Proceso de Admisión',
    STEPS: [
      {
        NUMBER: 'Paso 1',
        TITLE: 'Solicita tu Ficha',
        TEXT:
          'Completa el formulario de registro en línea y obtén tu ficha de admisión.'
      },
      {
        NUMBER: 'Paso 2',
        TITLE: 'Presenta tu Examen',
        TEXT: 'Realiza el examen de admisión en la fecha y hora asignadas.'
      },
      {
        NUMBER: 'Paso 3',
        TITLE: 'Inscríbete',
        TEXT:
          'Si apruebas, completa tu inscripción y comienza tu carrera universitaria.'
      }
    ],
    REGISTER_BUTTON: 'Iniciar registro',
    REQUIREMENTS_TITLE: 'Requisitos de Admisión',
    REQUIREMENTS: [
      'Certificado de bachillerato o constancia de estudios',
      'Acta de nacimiento (original y copia)',
      'CURP (original y copia)',
      '6 fotografías tamaño infantil',
      'Comprobante de domicilio'
    ],
    DATES_TITLE: 'Fechas Importantes',
    DATES: [
      { LABEL: 'Registro en Línea', VALUE: 'Enero - Junio 2026' },
      { LABEL: 'Examen de Admisión', VALUE: '15 de Julio 2026' },
      { LABEL: 'Publicación de Resultados', VALUE: '25 de Julio 2026' },
      { LABEL: 'Inscripciones', VALUE: '1 - 15 de Agosto 2026' }
    ],
    CTA_TITLE: '¿Necesitas más información?',
    CTA_TEXT:
      'Nuestro equipo de atención a aspirantes está listo para resolver todas tus dudas sobre el proceso de admisión.',
    CTA_CONTACT: 'Contactar Admisiones',
    CTA_GUIDE: 'Descargar Guía',
    MODAL_TITLE: 'Testimonio de Egresado'
  }
};

@Component({
  selector: 'app-aspirantes-pages',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './aspirantes-pages.component.html',
  styleUrls: ['./aspirantes-pages.component.css']
})
export class AspirantesPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);

  content = signal(defaultContent);

  testimonios = [
    {
      frase:
        'La carrera me brindó las herramientas necesarias para ingresar al mundo laboral',
      nombre: 'Juan Pérez',
      generacion: 'Egresado 2022'
    },
    {
      frase: 'Los proyectos prácticos marcaron la diferencia en mi formación',
      nombre: 'María López',
      generacion: 'Egresada 2021'
    },
    {
      frase: 'Excelente nivel académico y docentes comprometidos',
      nombre: 'Carlos Gómez',
      generacion: 'Egresado 2020'
    }
  ];

  testimonioActivo: any = null;

  constructor() {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/aspirantes.${fileLang}.json`)
        .subscribe((data) => {
          this.content.set(data as typeof defaultContent);
        });
    });
  }

  openTestimonio(testimonio: any) {
    this.testimonioActivo = testimonio;
    document.body.style.overflow = 'hidden';
  }

  closeTestimonio() {
    this.testimonioActivo = null;
    document.body.style.overflow = '';
  }
}
