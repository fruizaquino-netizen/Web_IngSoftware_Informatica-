import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de tener esta línea
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tecnologia',
   imports: [CommonModule, RouterLink],
  templateUrl: './tecnologia.component.html',
  styleUrls: ['./tecnologia.component.css']
})
export class TecnologiaComponent {}
