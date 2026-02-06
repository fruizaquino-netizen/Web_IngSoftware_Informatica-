import { Component, OnInit } from '@angular/core'; // 1. Importamos OnInit
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tecnologia',
  standalone: true, // Mantén esto si tus otros componentes también lo son
  imports: [CommonModule, RouterLink],
  templateUrl: './tecnologia.component.html',
  styleUrls: ['./tecnologia.component.css']
})
export class TecnologiaComponent implements OnInit { // 2. Implementamos la interfaz

  ngOnInit(): void {
    // 3. Al iniciar, mandamos el scroll al punto 0 de X y 0 de Y
    window.scrollTo(0, 0);
  }

}
