import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  public currentLang = 'español';
  public translations: any = {};

  private langChanged = new BehaviorSubject<string>(this.currentLang);
  langChanged$ = this.langChanged.asObservable();

  constructor() {
    const savedLang = localStorage.getItem('lang');
    this.changeLanguage(savedLang || this.currentLang);
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);

    fetch(`assets/i18n/${lang}/${lang}.json`)
      .then(res => res.json())
      .then(data => {
        this.translations = data;
        this.langChanged.next(lang); // 🔥 Notifica a toda la app
      })
      .catch(() => console.error('Error cargando idioma:', lang));
  }

  translate(key: string): string {
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations) || key;
  }
}
