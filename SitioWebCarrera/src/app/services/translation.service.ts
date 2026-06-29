import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly langFiles = {
    es: 'es',
    en: 'en',
    zapoteco: 'zapoteco'
  } as const;

  currentLang = signal<keyof typeof this.langFiles>('es');

  public translationsData = signal<any>({});

  changeLanguage(lang: keyof typeof this.langFiles) {
    this.currentLang.set(lang);
  }

  public loadTranslations(lang: keyof typeof this.langFiles) {
    this.translationsData.set({ lang: this.langFiles[lang] });
  }

  translate(key: string): string {
    const data = this.translationsData();
    return key.split('.').reduce((o, i) => (o ? o[i] : null), data) || key;
  }
}
