import {Component} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {SidebarService} from '../../../../services/sidebar/sidebar.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [NgIf, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(public sbService: SidebarService) {}
}
