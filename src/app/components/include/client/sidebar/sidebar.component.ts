import {Component} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {SidebarService} from '../../../../services/sidebar/sidebar.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, NgClass, TranslateModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(public sbService: SidebarService) {}
}
