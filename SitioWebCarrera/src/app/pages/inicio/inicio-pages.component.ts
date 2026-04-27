import { Component, inject, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';

const defaultContent = {
  INICIO: {
    NEWS_TICKER: 'NOTICIAS',
    CALENDAR_BUTTON: 'CALENDARIO DE EVENTOS',
    HERO_TITLE: 'Innovación tecnológica con sentido humano',
    HERO_BUTTON: 'Inicia tu proceso de ingreso aquí',
    FEATURES: [
      {
        TITLE: 'Excelencia Académica',
        TEXT: 'Programas educativos de alta calidad enfocados en el desarrollo integral.'
      },
      {
        TITLE: 'Tecnología Avanzada',
        TEXT: 'Infraestructura moderna y recursos tecnológicos de vanguardia.'
      },
      {
        TITLE: 'Vinculación Regional',
        TEXT: 'Conexión directa con el sector productivo de la región.'
      }
    ],
    CTA: {
      TITLE: '¿Listo para comenzar?',
      TEXT: 'Únete a nuestra comunidad universitaria.',
      BUTTON_MORE: 'Conoce más',
      BUTTON_CONTACT: 'Contáctanos'
    },
    CONTACT_MODAL: {
      TITLE: 'Contacto Directo',
      SUBTITLE: 'Completa los datos para enviarnos un correo.',
      PLACEHOLDER_NAME: 'Nombre completo',
      PLACEHOLDER_EMAIL: 'tu@correo.com',
      PLACEHOLDER_MESSAGE: '¿En qué podemos ayudarte?',
      SEND_BUTTON: 'Enviar por Gmail',
      WHATSAPP_TEXT: 'Chatea con nosotros',
      OR: 'o también',
      VALIDATION: 'Por favor, completa todos los campos para continuar.'
    },
    NEWS_MODAL: {
      HEADER: 'Noticias Informática'
    },
    CALENDAR: {
      MONTHS: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      DAYS: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'],
      SIDEBAR_TITLE: 'Próximos Eventos',
      NO_EVENTS: 'No hay eventos para este día.'
    },
    NEWS: [
      {
        TITLE: 'Nuevo Laboratorio de IA',
        DATE: '25 de Mayo, 2024',
        CONTENT: 'Se inaugura el centro de cómputo avanzado para proyectos de Inteligencia Artificial en el campus Ixtepec.'
      },
      {
        TITLE: 'Convenio con Google Cloud',
        DATE: '18 de Mayo, 2024',
        CONTENT: 'Alumnos de Informática tendrán acceso a certificaciones oficiales de la nube de Google.'
      },
      {
        TITLE: 'Hackathon Regional',
        DATE: '12 de Mayo, 2024',
        CONTENT: 'Participa en el próximo encuentro de desarrollo de software para el Istmo.'
      }
    ],
    EVENTS: [
      { DAY: 1, MONTH: 0, TITLE: 'Día Inhábil', TIME: 'Todo el día', DESC: 'Año Nuevo' },
      { DAY: 2, MONTH: 0, TITLE: 'Fin de Vacaciones', TIME: '08:00 AM', DESC: 'Reincorporación' },
      { DAY: 19, MONTH: 0, TITLE: 'Exámenes Parciales', TIME: '09:00 AM', DESC: '3er Parcial (Inicia)' },
      { DAY: 26, MONTH: 0, TITLE: 'Exámenes Parciales', TIME: '04:00 PM', DESC: '3er Parcial (Termina)' },
      { DAY: 30, MONTH: 0, TITLE: 'Exámenes Ordinarios', TIME: '09:00 AM', DESC: 'Inician exámenes ordinarios' },
      { DAY: 2, MONTH: 1, TITLE: 'Día Inhábil', TIME: 'Todo el día', DESC: 'Constitución Mexicana' },
      { DAY: 9, MONTH: 1, TITLE: 'Fin de Semestre', TIME: '05:00 PM', DESC: 'Cierre Ciclo A' },
      { DAY: 13, MONTH: 1, TITLE: 'Exámenes Extraordinarios', TIME: '09:00 AM', DESC: 'Periodo de regularización' },
      { DAY: 23, MONTH: 1, TITLE: 'Inscripciones', TIME: '08:00 AM', DESC: 'Reinscripciones Ciclo B' },
      { DAY: 2, MONTH: 2, TITLE: 'Inicio de Semestre', TIME: '08:00 AM', DESC: 'Ciclo 2025-2026 B' },
      { DAY: 12, MONTH: 2, TITLE: 'Examen Especial', TIME: '10:00 AM', DESC: 'Evaluación especial' },
      { DAY: 16, MONTH: 2, TITLE: 'Día Inhábil', TIME: 'Todo el día', DESC: 'Natalicio de Benito Juárez' },
      { DAY: 30, MONTH: 2, TITLE: 'Vacaciones', TIME: 'Todo el día', DESC: 'Semana Santa' },
      { DAY: 6, MONTH: 3, TITLE: 'Exámenes Parciales', TIME: '09:00 AM', DESC: '1er Parcial Ciclo B' },
      { DAY: 13, MONTH: 3, TITLE: 'Regreso de Vacaciones', TIME: '08:00 AM', DESC: 'Fin periodo semana santa' },
      { DAY: 1, MONTH: 4, TITLE: 'Día Inhábil', TIME: 'Todo el día', DESC: 'Día del Trabajo' },
      { DAY: 6, MONTH: 4, TITLE: 'Exámenes Parciales', TIME: '09:00 AM', DESC: '2do Parcial Ciclo B' },
      { DAY: 23, MONTH: 4, TITLE: 'Examen de Ingreso', TIME: '08:00 AM', DESC: 'Primer examen de admisión' },
      { DAY: 10, MONTH: 5, TITLE: 'Exámenes Parciales', TIME: '09:00 AM', DESC: '3er Parcial Ciclo B' },
      { DAY: 23, MONTH: 5, TITLE: 'Exámenes Ordinarios', TIME: '09:00 AM', DESC: 'Periodo ordinario Ciclo B' },
      { DAY: 30, MONTH: 5, TITLE: 'Fin de Semestre', TIME: '05:00 PM', DESC: 'Cierre Ciclo B' },
      { DAY: 1, MONTH: 6, TITLE: 'Examen de Ingreso', TIME: '08:00 AM', DESC: 'Segundo examen de admisión' },
      { DAY: 3, MONTH: 6, TITLE: 'Exámenes Extraordinarios', TIME: '09:00 AM', DESC: 'Regularización Ciclo B' },
      { DAY: 13, MONTH: 6, TITLE: 'Vacaciones', TIME: 'Todo el día', DESC: 'Periodo de verano' },
      { DAY: 27, MONTH: 6, TITLE: 'Curso Propedéutico', TIME: '08:00 AM', DESC: 'Inicio propedéutico y verano' },
      { DAY: 12, MONTH: 7, TITLE: 'Exámenes Verano', TIME: '09:00 AM', DESC: '1er Parcial (Verano)' },
      { DAY: 28, MONTH: 7, TITLE: 'Exámenes Verano', TIME: '09:00 AM', DESC: '2do Parcial (Verano)' },
      { DAY: 14, MONTH: 8, TITLE: 'Exámenes Verano', TIME: '09:00 AM', DESC: '3er Parcial (Verano)' },
      { DAY: 16, MONTH: 8, TITLE: 'Día Inhábil', TIME: 'Todo el día', DESC: 'Independencia de México' },
      { DAY: 18, MONTH: 8, TITLE: 'Fin de Cursos', TIME: '05:00 PM', DESC: 'Termina propedéutico/verano' }
    ]
  }
};

@Component({
  selector: 'inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './inicio-pages.component.html',
  styleUrl: './inicio-pages.component.css',
})
export class InicioPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);

  content = signal(defaultContent);

  isCalendarVisible: boolean = false;

  // --- Lógica de navegación del calendario ---
  viewDate: Date = new Date();
  monthNames: string[] = defaultContent.INICIO.CALENDAR.MONTHS;
  daysOfWeek: string[] = defaultContent.INICIO.CALENDAR.DAYS;
  calendarDays: (number | null)[] = [];

  // --- Variables para Eventos ---
  selectedDay: number | null = null;
  eventosDelDia: any[] = [];
  todosLosEventos = defaultContent.INICIO.EVENTS.map((e) => ({
    dia: e.DAY,
    mes: e.MONTH,
    titulo: e.TITLE,
    hora: e.TIME,
    descripcion: e.DESC
  }));

  // --- Noticias ---
  noticias = defaultContent.INICIO.NEWS.map((n) => ({
    titulo: n.TITLE,
    fecha: n.DATE,
    contenido: n.CONTENT
  }));

  selectedNews: any = null;

  constructor() {
    this.generateCalendar();

    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/inicio.${fileLang}.json`)
        .subscribe((data) => {
          this.content.set(data as typeof defaultContent);
          this.applyContent();
        });
    });
  }

  private applyContent() {
    const data = this.content().INICIO;
    this.monthNames = data.CALENDAR.MONTHS;
    this.daysOfWeek = data.CALENDAR.DAYS;
    this.noticias = data.NEWS.map((n) => ({
      titulo: n.TITLE,
      fecha: n.DATE,
      contenido: n.CONTENT
    }));
    this.todosLosEventos = data.EVENTS.map((e) => ({
      dia: e.DAY,
      mes: e.MONTH,
      titulo: e.TITLE,
      hora: e.TIME,
      descripcion: e.DESC
    }));
    this.selectedNews = null;
    this.selectedDay = null;
    this.eventosDelDia = [];
  }

  // Función para saber si un día específico tiene eventos
  hasEvents(day: number | null): boolean {
    if (!day) return false;
    const currentMonth = this.viewDate.getMonth();
    return this.todosLosEventos.some(e => e.dia === day && e.mes === currentMonth);
  }

  selectDay(day: number | null) {
    if (!day) return;
    this.selectedDay = day;
    const currentMonth = this.viewDate.getMonth();
    // Filtramos por día Y mes actual
    this.eventosDelDia = this.todosLosEventos.filter(e => e.dia === day && e.mes === currentMonth);
  }

  // --- Métodos de Acción ---
  toggleCalendar(): void {
    this.isCalendarVisible = !this.isCalendarVisible;
    // Resetear selección al cerrar/abrir
    if (!this.isCalendarVisible) {
      this.selectedDay = null;
      this.eventosDelDia = [];
    }
  }

  closeCalendar(): void {
    this.isCalendarVisible = false;
    this.selectedDay = null;
    this.eventosDelDia = [];
  }

  openNews(noticia: any) {
    this.selectedNews = noticia;
  }

  closeNews() {
    this.selectedNews = null;
  }

  // --- Generación de Calendario ---
  generateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    let startingDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    this.calendarDays = days;
  }

  changeMonth(delta: number): void {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + delta,
      1
    );
    this.generateCalendar();
    // Limpiar selección al cambiar de mes
    this.selectedDay = null;
    this.eventosDelDia = [];
  }

  get currentMonthName(): string {
    return this.monthNames[this.viewDate.getMonth()];
  }

  get currentYear(): number {
    return this.viewDate.getFullYear();
  }

  // Añade esto a tu clase InicioPageComponent
  isContactModalVisible: boolean = false;

  toggleContactModal(): void {
    this.isContactModalVisible = !this.isContactModalVisible;
  }

  sendContact(nombre: string, email: string, asunto: string): void {
    if (!nombre || !email || !asunto) {
      alert(this.content().INICIO.CONTACT_MODAL.VALIDATION);
      return;
    }

    const destinatario = 'jefatura_informatica@unistmo.edu.mx';

    // Construimos el cuerpo del mensaje de forma legible
    const cuerpo = `Hola, mi nombre es: ${nombre}%0D%0AMi correo de contacto: ${email}%0D%0A%0D%0AAsunto:%0D%0A${asunto}`;

    // URL directa de Gmail para redactar (Compose)
    // view=cm activa el modo "Compose Message"
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${encodeURIComponent(asunto)}&body=${cuerpo}`;

    // Abrir en una nueva pestaña
    window.open(gmailUrl, '_blank');

    // Cerramos el modal después de abrir la pestaña
    this.toggleContactModal();
  }
}
