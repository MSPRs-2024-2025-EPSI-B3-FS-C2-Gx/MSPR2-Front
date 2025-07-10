import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageOption} from '../../models/lang.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public languages: LanguageOption[] = [
    {code: 'en', name: 'LANGUAGE.ENGLISH', flag: '🇺🇸'},
    {code: 'fr', name: 'LANGUAGE.FRENCH', flag: '🇫🇷'},
    {code: 'de', name: 'LANGUAGE.GERMAN', flag: '🇩🇪'},
    {code: 'it', name: 'LANGUAGE.ITALIAN', flag: '🇮🇹'},
    {code: 'es', name: 'LANGUAGE.SPANISH', flag: '🇪🇸'},
  ];
  private readonly STORAGE_KEY = 'user_language';

  constructor(private translate: TranslateService) {
    // Set the default language
    translate.setDefaultLang('en');

    // Get the saved language from localStorage or use browser language
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    const browserLang = translate.getBrowserLang() || 'en';
    const languageToUse = savedLanguage || (['en', 'fr', 'de', 'it', 'es'].includes(browserLang) ? browserLang : 'en');

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

  public getCurrentFlag(): string {
    const currentLanguage = this.getCurrentLanguage();
    const language = this.languages.find((lang) => lang.code === currentLanguage);
    return language ? language.flag : '🇺🇸';
  }

  public getLanguages(): LanguageOption[] {
    // Retourne les langues avec les noms traduits
    return this.languages.map(lang => ({
      ...lang,
      name: this.translate.instant(lang.name) // Traduit le nom de la langue
    }));
  }
}
