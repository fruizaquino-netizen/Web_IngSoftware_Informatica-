import { Component, OnInit } from '@angular/core'; // 1. Agregamos OnInit aquí
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-excelencia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './excelencia.component.html',
  styleUrl: './excelencia.component.css'
})
export class ExcelenciaComponent implements OnInit { // 2. Agregamos "implements OnInit"

  constructor() {}

  ngOnInit(): void {
    // 3. Esta línea fuerza al navegador a subir al inicio al cargar el componente
    window.scrollTo(0, 0);
  }

}
