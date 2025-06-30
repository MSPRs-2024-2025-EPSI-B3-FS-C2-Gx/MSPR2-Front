import {Component, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgFor, NgIf, NgStyle} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {SidebarService} from '../../../services/sidebar/sidebar.service';
import {SearchService} from '../../../services/search/search.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf, RouterLinkActive, NgStyle, FormsModule, NgFor],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  mobileMenuOpen = false;
  clientDropdownOpen = false;
  dropdownStyles = {};

  searchQuery = '';
  searchResults: any[] = [];
  showResults = false;

  constructor(public authService: AuthService, public sbService: SidebarService, private searchService: SearchService) {
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
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
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
