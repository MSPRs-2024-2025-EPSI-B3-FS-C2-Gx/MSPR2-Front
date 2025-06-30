import {AfterViewInit, Component, OnInit} from '@angular/core';
import { NgClass } from '@angular/common';
import { SidebarComponent } from '../../../../include/client/sidebar/sidebar.component';
import { DataService } from '../../../../../services/data/data.service';
import { UtilService } from '../../../../../services/util/util.service';

@Component({
  selector: 'app-cartography',
  standalone: true,
  imports: [
    NgClass,
    SidebarComponent
  ],
  templateUrl: './cartography.component.html',
  styleUrls: ['./cartography.component.css']
})
export class CartographyComponent {
  selectedMetric: 'cases' | 'deaths' = 'cases';

  constructor(
    public dataService: DataService,
    private utilService: UtilService
  ) {}


  selectMetric(metric: 'cases' | 'deaths') {
    this.selectedMetric = metric;
  }

}
