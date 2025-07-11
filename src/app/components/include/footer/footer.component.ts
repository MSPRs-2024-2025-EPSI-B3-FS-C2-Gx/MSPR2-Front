import {Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
