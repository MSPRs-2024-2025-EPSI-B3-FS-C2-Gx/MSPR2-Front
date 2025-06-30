import {Component} from '@angular/core';
import {SidebarComponent} from '../../../include/client/sidebar/sidebar.component';
import {toast} from 'ngx-sonner';
import {DataService} from '../../../../services/data/data.service';
import Chart from 'chart.js/auto';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    SidebarComponent,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  totalCases: number = 0;
  totalVaccinations: number = 0;
  totalDeaths: number = 0;
  selectedMetric: 'cases' | 'deaths' = 'deaths';

  constructor(public dataService: DataService) {
    this.loadData();
  }

  private loadData() {
    this.dataService.getTotalCases().subscribe(data => {
      this.totalCases = data;
    })

    this.dataService.getTotalVaccinations().subscribe(data => {
      this.totalVaccinations = data;
    })

    this.dataService.getTotalDeaths().subscribe(data => {
      this.totalDeaths = data;
    })
  }

  onLeaderMetricChange(event: any) {
    this.selectedMetric = event.target.value === 'cases' ? 'cases' : 'deaths';
    console.log('Métrique sélectionnée :', this.selectedMetric);
  }
}
