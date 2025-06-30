import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';

@Component({
  selector: 'app-cartography',
  imports: [
    NgClass,
    SidebarComponent
  ],
  templateUrl: './cartography.component.html',
  styleUrls: ['./cartography.component.css']
})
export class CartographyComponent {
  selectedMetric: 'cases' | 'deaths' = 'cases';

  constructor(public dataService: DataService) {
  }

  ngOnInit(): void {
    this.loadMap();
  }

  selectMetric(metric: 'cases' | 'deaths') {
    this.selectedMetric = metric;
    this.updateMapData(metric);
  }

  loadMap() {
    // Exemple avec Leaflet ou autre lib JS à appeler ici
    console.log('Carte chargée');
  }

  updateMapData(metric: string) {
    console.log(`Métrique sélectionnée : ${metric}`);
    // À relier avec un système de données pour changer dynamiquement la couleur ou les données sur la carte
  }
}
