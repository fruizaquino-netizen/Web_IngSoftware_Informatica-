import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos-page.component.html',
  styleUrls: ['./proyectos-page.component.css']
})

export class ProyectoPageComponent {
  galleryImages = [
    // Áreas físicas
    'assets/img/Electronica1.jpg',
    'assets/img/Elect.jpg',
    'assets/img/SalaRedes.jpg',
    'assets/img/Auditorio.jpg',
    'assets/img/Estatua.jpg',
    'assets/img/Electronica2.jpg',
    'assets/img/ConcursoAltar1.jpg',
    'assets/img/ConcursoAltar2.jpg',
    'assets/img/Viaje_EscNaval1.jpg',
    'assets/img/Viaje_EscNaval2.jpg',
    'assets/img/Viaje_EscNaval3.jpg',
    'assets/img/Viaje_Supercool.jpg',
    'assets/img/Viaje_Thyssenkrupp1.png',
    'assets/img/Viaje_Thyssenkrupp2.png',
    'assets/img/Viaje_Thyssenkrupp3.jpg',
    'assets/img/Viaje_Thyssenkrupp4.jpg',
    'assets/img/Viaje_UDLAP1.jpg',
    'assets/img/Viaje_UDLAP2.jpg',
    'assets/img/Viaje_UDLAP3.jpg',
    'assets/img/Viaje_UniVeracruz.jpg',
    'assets/img/Curso_2023.jpg'
  ];


  activeImage = 0;
  galleryOpen = false;

  openGallery(index: number) {
    this.activeImage = index;
    this.galleryOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeGallery() {
    this.galleryOpen = false;
    document.body.style.overflow = '';
  }

  next() {
    this.activeImage =
      (this.activeImage + 1) % this.galleryImages.length;
  }

  prev() {
    this.activeImage =
      (this.activeImage - 1 + this.galleryImages.length) % this.galleryImages.length;
  }
}
