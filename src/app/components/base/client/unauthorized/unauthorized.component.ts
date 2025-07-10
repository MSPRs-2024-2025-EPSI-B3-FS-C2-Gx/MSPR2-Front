import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {SidebarComponent} from '../../../include/client/sidebar/sidebar.component';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [TranslateModule, SidebarComponent],
  templateUrl: './unauthorized.component.html'
})
export class UnauthorizedComponent {

  constructor(
    private location: Location,
    private router: Router
  ) {
  }

  goBack(): void {
    this.location.back();
  }
}
