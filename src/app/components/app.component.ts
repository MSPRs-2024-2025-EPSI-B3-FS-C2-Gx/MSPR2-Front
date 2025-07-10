import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './include/navbar/navbar.component';
import {FooterComponent} from './include/footer/footer.component';
import {NgxSonnerToaster} from 'ngx-sonner';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    NgxSonnerToaster,
    TranslateModule,
  ],
  template: `
    <ngx-sonner-toaster position="bottom-left" richColors/>

    <app-navbar></app-navbar>

    <router-outlet></router-outlet>

    <app-footer></app-footer>
  `
})

export class AppComponent {
  title = 'MSPR2';

  constructor() {
  }
}
