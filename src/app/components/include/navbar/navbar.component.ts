import {Component, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgFor, NgIf, NgStyle} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {SidebarService} from '../../../services/sidebar/sidebar.service';
import {SearchService} from '../../../services/search/search.service';
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LanguageOption, TranslationService} from '../../../services/translation/translation.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf, RouterLinkActive, NgStyle, FormsModule, NgFor, NgClass, TranslateModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  mobileMenuOpen = false;
  clientDropdownOpen = false;
  dropdownStyles = {};
  languageDropdownOpen = false;

  searchQuery = '';
  searchResults: any[] = [];
  showResults = false;

  currentLanguage: string = 'fr';
  currentFlag: string = '🇫🇷';
  languages: LanguageOption[] = [];

  constructor(
    public authService: AuthService,
    public sbService: SidebarService,
    private searchService: SearchService,
    private translate: TranslateService,
    private translationService: TranslationService
  ) {
    console.log('Initialisation de la navbar');
    this.updateLanguages();
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.currentFlag = this.translationService.getCurrentFlag();

    // S'abonner aux changements de langue
    this.translate.onLangChange.subscribe(() => {
      this.updateLanguages();
      this.currentLanguage = this.translationService.getCurrentLanguage();
      this.currentFlag = this.translationService.getCurrentFlag();
    });
  }

  private updateLanguages(): void {
    this.languages = this.translationService.getLanguages();
    console.log('Langues disponibles mises à jour:', this.languages);
  }

  onSearch(): void {
    if (this.searchQuery.length > 2) {
      this.searchResults = this.searchService.search(this.searchQuery);
      this.showResults = true;
    } else {
      this.searchResults = [];
      this.showResults = false;
    }
  }

  selectResult(result: any): void {
    this.searchService.navigateToResult(result);
    this.searchQuery = '';
    this.showResults = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.showResults = false;
    }

    // Fermer les menus déroulants si on clique en dehors
    if (!target.closest('.language-selector') && !target.closest('#language-dropdown-button')) {
      this.languageDropdownOpen = false;
    }

    if (!target.closest('#user-menu-button') && !target.closest('#user-menu')) {
      this.clientDropdownOpen = false;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleLanguageDropdown(event: Event) {
    event.stopPropagation();
    this.languageDropdownOpen = !this.languageDropdownOpen;
    this.clientDropdownOpen = false; // Fermer l'autre menu
  }

  changeLanguage(languageCode: string, event: Event) {
    event.preventDefault();
    this.translationService.useLanguage(languageCode);
    this.currentLanguage = languageCode;
    this.currentFlag = this.translationService.getCurrentFlag();
    this.languageDropdownOpen = false;
  }

  toggleClientDropdown(button?: HTMLElement) {
    this.clientDropdownOpen = !this.clientDropdownOpen;

    if (this.clientDropdownOpen && button) {
      const rect = button.getBoundingClientRect();

      this.dropdownStyles = {
        position: 'fixed',
        top: `${rect.bottom + 5}px`, // 5px en dessous du bouton
        left: `${rect.left - 150}px`,
        width: '192px', // largeur du menu (48 * 4 = 192px)
        zIndex: '9999',
      };
    }
  }

  // Pour fermer le dropdown si on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('#user-menu-button') || target.closest('#user-menu');
    if (!clickedInside) {
      this.clientDropdownOpen = false;
    }
  }
}
