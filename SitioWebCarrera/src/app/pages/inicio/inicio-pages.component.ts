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

  // Lógica de navegación del calendario
  viewDate: Date = new Date();
  monthNames: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  daysOfWeek: string[] = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
  calendarDays: (number | null)[] = [];

  constructor() {
    this.generateCalendar();
  }

  toggleCalendar(): void {
    this.isCalendarVisible = !this.isCalendarVisible;
  }

  closeCalendar(): void {
    this.isCalendarVisible = false;
  }

  // Genera los días del mes actual
  generateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    // Primer día del mes (0 es domingo, 1 lunes...)
    let firstDay = new Date(year, month, 1).getDay();
    // Ajuste para que empiece en Lunes (Lunes=0, ..., Domingo=6)
    let startingDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Rellenar espacios vacíos antes del primer día
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Rellenar los días del mes
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
  }

  get currentMonthName(): string {
    return this.monthNames[this.viewDate.getMonth()];
  }

  get currentYear(): number {
    return this.viewDate.getFullYear();
  }
}
