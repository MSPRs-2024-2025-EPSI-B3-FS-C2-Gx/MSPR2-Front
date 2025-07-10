import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './error.component.html'
})
export class ErrorComponent {

  constructor(private authService: AuthService, private router: Router) {
  }

  async redirect(): Promise<void> {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/client']).then(() => console.log('Navigated to client'));
      return;
    }

    this.router.navigate(['/']).then(() => console.log('Navigated to home'));
  }
}
