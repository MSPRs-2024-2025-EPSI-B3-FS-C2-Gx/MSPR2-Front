import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
