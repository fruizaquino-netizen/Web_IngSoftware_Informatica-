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
    'assets/img/Electronica1.jpg',
    'assets/img/Elect.jpg',
    'assets/img/SalaRedes.jpg',
    'assets/img/Auditorio.jpg',
    'assets/img/Estatua.jpg',
    'assets/img/Electronica2.jpg'
  ];

  activeImage = 0;
  galleryOpen = false;

  openGallery(index: number) {
    this.activeImage = index;
    this.galleryOpen = true;
  }

  closeGallery() {
    this.galleryOpen = false;
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
