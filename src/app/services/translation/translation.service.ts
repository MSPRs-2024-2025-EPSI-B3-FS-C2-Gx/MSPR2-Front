import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface LanguageOption {
  code: string;
  name: string;
  goodName: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'user_language';

  public languages: LanguageOption[] = [
    { code: 'en', name: 'LANGUAGE.ENGLISH', goodName: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'LANGUAGE.FRENCH', goodName: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'LANGUAGE.GERMAN', goodName: 'German', flag: '🇨🇭' }
  ];

  constructor(private translate: TranslateService) {
    // Set the default language
    translate.setDefaultLang('en');

    // Get the saved language from localStorage or use browser language
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    const browserLang = translate.getBrowserLang() || 'en';
    const languageToUse = savedLanguage || (['en', 'fr', 'de'].includes(browserLang) ? browserLang : 'en');

    this.useLanguage(languageToUse);
  }

  public useLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem(this.STORAGE_KEY, language);
    document.documentElement.lang = language;
  }

  public getCurrentLanguage(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  public getLanguages(): LanguageOption[] {
    return this.languages;
  }
}
