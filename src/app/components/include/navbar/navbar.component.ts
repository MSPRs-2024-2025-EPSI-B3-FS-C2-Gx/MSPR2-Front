import {Component, HostListener} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf, NgStyle} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {SidebarService} from '../../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf, RouterLinkActive, NgStyle],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  mobileMenuOpen = false;
  clientDropdownOpen = false;
  dropdownStyles = {};

  constructor(public authService: AuthService, public sbService: SidebarService) {
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
