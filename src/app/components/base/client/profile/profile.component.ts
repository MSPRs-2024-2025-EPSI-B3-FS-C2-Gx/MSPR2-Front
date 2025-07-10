import {Component} from '@angular/core';
import {SidebarComponent} from '../../../include/client/sidebar/sidebar.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [
    SidebarComponent,
    TranslateModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

  getEmail(): string {
    return localStorage.getItem('email') || '';
  }
}
