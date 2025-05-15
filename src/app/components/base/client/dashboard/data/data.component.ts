import { Component } from '@angular/core';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';

@Component({
  selector: 'app-data',
  imports: [
    SidebarComponent
  ],
  templateUrl: './data.component.html',
})
export class DataComponent {

  constructor(public dataService: DataService) {
  }
}
