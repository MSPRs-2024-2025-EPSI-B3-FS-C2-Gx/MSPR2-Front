import {Component} from '@angular/core';
import {SidebarComponent} from '../../../include/client/sidebar/sidebar.component';
import {toast} from 'ngx-sonner';
import {DataService} from '../../../../services/data/data.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(public dataService: DataService) {
  }
}
