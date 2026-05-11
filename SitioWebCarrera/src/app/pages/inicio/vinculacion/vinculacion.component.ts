import { Component, OnInit } from '@angular/core'; // 1. Importamos OnInit
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-vinculacion',
  standalone: true, // Aseguramos que sea Standalone como los otros
  imports: [CommonModule, RouterLink, BreadcrumbComponent],
  templateUrl: './vinculacion.component.html',
  styleUrls: ['./vinculacion.component.css']
})
export class VinculacionComponent implements OnInit { // 2. Implementamos OnInit

  ngOnInit(): void {
    // 3. Al entrar a Vinculación, el scroll sube al inicio
    window.scrollTo(0, 0);
  }

}
