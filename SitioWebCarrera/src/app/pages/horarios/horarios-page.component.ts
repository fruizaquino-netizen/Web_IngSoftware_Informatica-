import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-horarios-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './horarios-page.component.html',
  styleUrl: './horarios-page.component.css'
})
export class HorariosPageComponent {
  readonly scheduleUrl =
    'http://localhost:3000/api/documentos/horario.pdf';
}
