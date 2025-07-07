import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
