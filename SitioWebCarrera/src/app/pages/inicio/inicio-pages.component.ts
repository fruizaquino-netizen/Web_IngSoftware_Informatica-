import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio-pages.component.html',
  styleUrl: './inicio-pages.component.css',
})
export class InicioPageComponent {
  isCalendarVisible: boolean = false;

  // --- Lógica de navegación del calendario ---
  viewDate: Date = new Date();
  monthNames: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  daysOfWeek: string[] = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
  calendarDays: (number | null)[] = [];

  // --- Variables para Eventos ---
  selectedDay: number | null = null;
  eventosDelDia: any[] = [];
todosLosEventos = [
// --- ENERO 2026 (Mes 0) ---
{ dia: 1, mes: 0, titulo: 'Día Inhábil', hora: 'Todo el día', descripcion: 'Año Nuevo' },
{ dia: 2, mes: 0, titulo: 'Fin de Vacaciones', hora: '08:00 AM', descripcion: 'Reincorporación' },
{ dia: 19, mes: 0, titulo: 'Exámenes Parciales', hora: '09:00 AM', descripcion: '3er Parcial (Inicia)' },
{ dia: 26, mes: 0, titulo: 'Exámenes Parciales', hora: '04:00 PM', descripcion: '3er Parcial (Termina)' },
{ dia: 30, mes: 0, titulo: 'Exámenes Ordinarios', hora: '09:00 AM', descripcion: 'Inician exámenes ordinarios' },

// --- FEBRERO 2026 (Mes 1) ---
{ dia: 2, mes: 1, titulo: 'Día Inhábil', hora: 'Todo el día', descripcion: 'Constitución Mexicana' },
{ dia: 9, mes: 1, titulo: 'Fin de Semestre', hora: '05:00 PM', descripcion: 'Cierre Ciclo A' },
{ dia: 13, mes: 1, titulo: 'Exámenes Extraordinarios', hora: '09:00 AM', descripcion: 'Periodo de regularización' },
{ dia: 23, mes: 1, titulo: 'Inscripciones', hora: '08:00 AM', descripcion: 'Reinscripciones Ciclo B' },

// --- MARZO 2026 (Mes 2) ---
{ dia: 2, mes: 2, titulo: 'Inicio de Semestre', hora: '08:00 AM', descripcion: 'Ciclo 2025-2026 B' },
{ dia: 12, mes: 2, titulo: 'Examen Especial', hora: '10:00 AM', descripcion: 'Evaluación especial' },
{ dia: 16, mes: 2, titulo: 'Día Inhábil', hora: 'Todo el día', descripcion: 'Natalicio de Benito Juárez' },
{ dia: 30, mes: 2, titulo: 'Vacaciones', hora: 'Todo el día', descripcion: 'Semana Santa' },

// --- ABRIL 2026 (Mes 3) ---
{ dia: 6, mes: 3, titulo: 'Exámenes Parciales', hora: '09:00 AM', descripcion: '1er Parcial Ciclo B' },
{ dia: 13, mes: 3, titulo: 'Regreso de Vacaciones', hora: '08:00 AM', descripcion: 'Fin periodo semana santa' },

// --- MAYO 2026 (Mes 4) ---
{ dia: 1, mes: 4, titulo: 'Día Inhábil', hora: 'Todo el día', descripcion: 'Día del Trabajo' },
{ dia: 6, mes: 4, titulo: 'Exámenes Parciales', hora: '09:00 AM', descripcion: '2do Parcial Ciclo B' },
{ dia: 23, mes: 4, titulo: 'Examen de Ingreso', hora: '08:00 AM', descripcion: 'Primer examen de admisión' },

// --- JUNIO 2026 (Mes 5) ---
{ dia: 10, mes: 5, titulo: 'Exámenes Parciales', hora: '09:00 AM', descripcion: '3er Parcial Ciclo B' },
{ dia: 23, mes: 5, titulo: 'Exámenes Ordinarios', hora: '09:00 AM', descripcion: 'Periodo ordinario Ciclo B' },
{ dia: 30, mes: 5, titulo: 'Fin de Semestre', hora: '05:00 PM', descripcion: 'Cierre Ciclo B' },

// --- JULIO 2026 (Mes 6) ---
{ dia: 1, mes: 6, titulo: 'Examen de Ingreso', hora: '08:00 AM', descripcion: 'Segundo examen de admisión' },
{ dia: 3, mes: 6, titulo: 'Exámenes Extraordinarios', hora: '09:00 AM', descripcion: 'Regularización Ciclo B' },
{ dia: 13, mes: 6, titulo: 'Vacaciones', hora: 'Todo el día', descripcion: 'Periodo de verano' },
{ dia: 27, mes: 6, titulo: 'Curso Propedéutico', hora: '08:00 AM', descripcion: 'Inicio propedéutico y verano' },

// --- AGOSTO 2026 (Mes 7) ---
{ dia: 12, mes: 7, titulo: 'Exámenes Verano', hora: '09:00 AM', descripcion: '1er Parcial (Verano)' },
{ dia: 28, mes: 7, titulo: 'Exámenes Verano', hora: '09:00 AM', descripcion: '2do Parcial (Verano)' },

// --- SEPTIEMBRE 2026 (Mes 8) ---
{ dia: 14, mes: 8, titulo: 'Exámenes Verano', hora: '09:00 AM', descripcion: '3er Parcial (Verano)' },
{ dia: 16, mes: 8, titulo: 'Día Inhábil', hora: 'Todo el día', descripcion: 'Independencia de México' },
{ dia: 18, mes: 8, titulo: 'Fin de Cursos', hora: '05:00 PM', descripcion: 'Termina propedéutico/verano' }
  ];

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

  // --- Noticias ---
  noticias = [
    {
      titulo: 'Nuevo Laboratorio de IA',
      fecha: '25 de Mayo, 2024',
      contenido: 'Se inaugura el centro de cómputo avanzado para proyectos de Inteligencia Artificial en el campus Ixtepec.'
    },
    {
      titulo: 'Convenio con Google Cloud',
      fecha: '18 de Mayo, 2024',
      contenido: 'Alumnos de Informática tendrán acceso a certificaciones oficiales de la nube de Google.'
    },
    {
      titulo: 'Hackathon Regional',
      fecha: '12 de Mayo, 2024',
      contenido: 'Participa en el próximo encuentro de desarrollo de software para el Istmo.'
    }
  ];

  selectedNews: any = null;

  constructor() {
    this.generateCalendar();
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

sendContact(email: string): void {
  console.log('Correo enviado:', email);
  // Aquí puedes añadir la lógica para procesar el envío
  alert('¡Gracias! Nos pondremos en contacto pronto.');
  this.toggleContactModal();
}

}


