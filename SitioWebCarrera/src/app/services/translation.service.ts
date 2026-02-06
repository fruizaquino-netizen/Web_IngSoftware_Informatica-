import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslateService {

  public currentLang = 'español';
  public translations: any = {};

  getCurrentLang(): string {
    return this.currentLang;
  }

  changeLanguage(lang: string) {
    this.currentLang = lang;

    fetch(`assets/i18n/${lang}.json`)
      .then(res => res.json())
      .then(data => this.translations = data);
  }

  translate(key: string): string {
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations) || key;
  }
}
