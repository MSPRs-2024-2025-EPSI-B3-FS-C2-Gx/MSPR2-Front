import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';
import {UtilService} from '../../../../../services/util/util.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-cartography',
  standalone: true,
  imports: [
    NgClass,
    SidebarComponent
  ],
  templateUrl: './cartography.component.html'
})
export class CartographyComponent implements OnInit, AfterViewInit {
  selectedMetric: 'cases' | 'deaths' = 'cases';
  private map: L.Map | undefined;
  private geoJsonLayer: L.GeoJSON<any> | undefined;
  private circlesLayer: L.LayerGroup<any> | undefined;

  constructor(
    public dataService: DataService,
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadMapData();
  }

  selectMetric(metric: 'cases' | 'deaths') {
    this.selectedMetric = metric;
    this.loadMapData(); // Recharge les données et met à jour les cercles et couleurs
  }

  initMap() {
    this.map = L.map('map').setView([20, 0], 2); // Zoom sur le monde

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  loadMapData() {
    this.dataService.getMapData().subscribe((res: any) => {
      const data = res.data;

      // Supprimer couches existantes
      if (this.geoJsonLayer) {
        this.geoJsonLayer.remove();
      }
      if (this.circlesLayer) {
        this.circlesLayer.clearLayers();
      }

      this.circlesLayer = L.layerGroup().addTo(this.map!);

      // Charger GeoJSON mondial
      fetch('assets/custom.geo.json')
        .then(res => res.json())
        .then(geoData => {

          if (!geoData.features || !geoData.features.length) {
            console.warn('GeoJSON features missing or empty');
          }

          // Couche des pays colorés
          this.geoJsonLayer = L.geoJSON(geoData, {
            style: (feature: any) => {
              const countryCode = feature.properties.iso_a2_eh?.toUpperCase(); // au cas où c'est en minuscule
              const countryData = data.find((d: any) => d.country_code === countryCode);
              const value = this.selectedMetric === 'cases'
                ? countryData?.case_rate_percent
                : countryData?.death_rate_percent;

              return {
                fillColor: this.getColor(value),
                fillOpacity: 0.7,
                weight: 1,
                color: '#ccc'
              };
            }
          }).addTo(this.map!);

          // Ajouter cercles pour total_cases
          geoData.features.forEach((feature: any) => {
            const countryCode = feature.properties.iso_a2_eh?.toUpperCase(); // au cas où c'est en minuscule
            const countryData = data.find((d: any) => d.country_code === countryCode); // ✅ correction ici

            if (!countryData) {
              console.warn(`No data for country code: ${countryCode}`);
              return;
            }

            if (
              feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
            ) {
              const center = this.getFeatureCenter(feature);
              const radius = this.selectedMetric === 'cases'
                ? this.scaleRadius(countryData.total_cases)
                : this.scaleRadius(countryData.total_deaths);

              if (radius > 0) {
                const tooltipContent = this.selectedMetric === 'cases'
                  ? `
      <strong>${countryData.country_name}</strong><br>
      Cas confirmés : ${countryData.total_cases.toLocaleString()}<br>
      Population : ${countryData.population?.toLocaleString()}<br>
      Taux de cas : ${countryData.case_rate_percent?.toFixed(2)}%
    `
                  : `
      <strong>${countryData.country_name}</strong><br>
      Décès : ${countryData.total_deaths.toLocaleString()}<br>
      Population : ${countryData.population?.toLocaleString()}<br>
      Taux de décès : ${countryData.death_rate_percent?.toFixed(2)}%
    `;


                const circle = L.circleMarker(center, {
                  radius,
                  fillColor: 'blue',
                  fillOpacity: 0.5,
                  color: '#0033cc',
                  weight: 1
                }).bindTooltip(tooltipContent);

                this.circlesLayer!.addLayer(circle);
              }
            }
          });
        });
    });
  }


  getColor(value: number): string {
    if (!value) return '#ccc';
    return value > 75 ? '#800026' :
      value > 50 ? '#BD0026' :
        value > 25 ? '#E31A1C' :
          value > 10 ? '#FC4E2A' :
            value > 5 ? '#FD8D3C' :
              value > 1 ? '#FEB24C' :
                '#FFEDA0';
  }

  getFeatureCenter(feature: any): [number, number] {
    const coords = feature.geometry.coordinates;

    if (feature.geometry.type === 'Polygon') {
      return this.getPolygonCenter(coords[0]);
    } else if (feature.geometry.type === 'MultiPolygon') {
      let totalArea = 0;
      let weightedLat = 0;
      let weightedLng = 0;

      coords.forEach((polygonGroup: number[][][]) => {
        const polygon = polygonGroup[0]; // prendre le premier anneau
        const area = this.getPolygonArea(polygon);
        const center = this.getPolygonCenter(polygon);

        weightedLat += center[0] * area;
        weightedLng += center[1] * area;
        totalArea += area;
      });

      if (totalArea === 0) return [0, 0];

      return [weightedLat / totalArea, weightedLng / totalArea];
    }

    return [0, 0];
  }


  getPolygonCenter(polygon: number[][]): [number, number] {
    const total = polygon.reduce(
      (acc, coord) => [acc[0] + coord[1], acc[1] + coord[0]],
      [0, 0]
    );
    const lat = total[0] / polygon.length;
    const lng = total[1] / polygon.length;
    return [lat, lng];  // Leaflet: [lat, lng]
  }

  getPolygonArea(polygon: number[][]): number {
    // Approximate polygon area
    let area = 0;
    const len = polygon.length;
    for (let i = 0; i < len; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[(i + 1) % len];
      area += (x1 * y2 - x2 * y1);
    }
    return Math.abs(area / 2);
  }

  scaleRadius(value: number): number {
    if (!value) return 0;
    return Math.sqrt(value) / 2000;  // Ajuste selon la visibilité désirée
  }


}
