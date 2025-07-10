import {Component} from '@angular/core';
import {SidebarComponent} from '../../../include/client/sidebar/sidebar.component';
import {TranslateModule} from '@ngx-translate/core';
import {AuthService} from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    SidebarComponent,
    TranslateModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

  constructor(public authService: AuthService) {
  }

  getEmail(): string {
    return localStorage.getItem('email') || '';
  }
}
