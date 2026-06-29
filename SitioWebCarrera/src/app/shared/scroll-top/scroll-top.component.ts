import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent {

  isVisible = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    if (typeof window === 'undefined') {
      return;
    }

    this.isVisible = window.scrollY > 300;
  }

  scrollToTop() {
    if (typeof window === 'undefined') {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
