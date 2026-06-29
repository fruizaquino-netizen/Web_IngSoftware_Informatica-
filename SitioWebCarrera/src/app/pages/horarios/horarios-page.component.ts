import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-horarios-page',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './horarios-page.component.html',
  styleUrl: './horarios-page.component.css'
})
export class HorariosPageComponent {
  readonly scheduleUrl = 'http://localhost:3000/api/documentos/horario.pdf';
  readonly scheduleViewerUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.scheduleViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.scheduleUrl}#view=FitH`
    );
  }
}
