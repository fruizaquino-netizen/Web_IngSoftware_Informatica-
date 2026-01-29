import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de tener esta línea
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-vinculacion',
  imports: [CommonModule, RouterLink],
  templateUrl: './vinculacion.component.html',
  styleUrls: ['./vinculacion.component.css']
})
export class VinculacionComponent {}
