import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de tener esta línea
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-excelencia',
  standalone: true,
  imports: [CommonModule, RouterLink], // Solo una vez y con coma al final
  templateUrl: './excelencia.component.html',
  styleUrl: './excelencia.component.css'
})
export class ExcelenciaComponent {}
