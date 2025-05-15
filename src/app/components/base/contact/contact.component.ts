import {Component} from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
