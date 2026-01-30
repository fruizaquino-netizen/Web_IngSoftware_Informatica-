import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quienes-somos',
  standalone: true, // Según tu estructura de archivos
  templateUrl: './quienesSomos-page.component.html',
  styleUrls: ['./quienesSomos-page.component.css']
})
export class QuienesSomosPageComponent implements OnInit {

  ngOnInit(): void {
    // Esto asegura que al hacer clic en "Conoce más", la página cargue desde arriba
    window.scrollTo(0, 0);
  }
}
