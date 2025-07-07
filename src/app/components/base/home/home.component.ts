import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
