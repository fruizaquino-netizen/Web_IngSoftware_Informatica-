import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public http = inject(HttpClient);

  private readonly langFiles = {
    es: 'assets/i18n/espaï¿½f�,±ol/espaï¿½f�,±ol.json',
    en: 'assets/i18n/en.json',
    zapoteco: 'assets/i18n/zapoteco/zapoteco.json'
  } as const;

  // Signal del idioma actual
  currentLang = signal<keyof typeof this.langFiles>('es');

  // Signal con la data cruda del JSON
  public translationsData = signal<any>({});

  constructor() {
    this.loadTranslations('es');
  }

  changeLanguage(lang: keyof typeof this.langFiles) {
    this.currentLang.set(lang);
    this.loadTranslations(lang);
  }

  public loadTranslations(lang: keyof typeof this.langFiles) {
    const path = this.langFiles[lang];
    this.http.get(path).subscribe({
      next: (data) => this.translationsData.set(data),
      error: () => console.error(`Error cargando idioma: ${lang}`)
    });
  }

  // FUNCIï¿½fï¿½f�f¢ï¿½?ï¿½oN CLAVE: Traduce buscando la ruta "HOME.TITLE" dentro del JSON
  translate(key: string): string {
    const data = this.translationsData();
    // Reduce recorre el objeto: data['HOME'] -> data['TITLE']
    return key.split('.').reduce((o, i) => (o ? o[i] : null), data) || key;
  }
}


