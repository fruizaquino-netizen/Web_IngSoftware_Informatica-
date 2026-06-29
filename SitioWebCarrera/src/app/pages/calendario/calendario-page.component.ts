import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-calendario-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './calendario-page.component.html',
  styleUrl: './calendario-page.component.css'
})
export class CalendarioPageComponent {
  readonly calendarUrl = 'http://localhost:3000/api/documentos/calendario.pdf';
  readonly calendarViewerUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.calendarViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.calendarUrl}#view=FitH`
    );
  }
}
