import { Component } from '@angular/core';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';

@Component({
  selector: 'app-prediction',
  imports: [
    SidebarComponent
  ],
  templateUrl: './prediction.component.html'
})
export class PredictionComponent {
  constructor(public dataService: DataService) {
  }
}
