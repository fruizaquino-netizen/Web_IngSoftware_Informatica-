import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-calendario-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './calendario-page.component.html',
  styleUrl: './calendario-page.component.css'
})
export class CalendarioPageComponent {
  readonly calendarUrl =
    'http://localhost:3000/api/documentos/calendario.pdf';
}
