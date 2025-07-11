import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';
import {UtilService} from '../../../../../services/util/util.service';
import * as L from 'leaflet';
import {toast} from 'ngx-sonner';
import {catchError, from, tap, throwError} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cartography',
  standalone: true,
  imports: [
    NgClass,
    SidebarComponent,
    TranslateModule
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
    private utilService: UtilService,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadMapData();
  }

  selectMetric(metric: 'cases' | 'deaths'): void {
    this.selectedMetric = metric;
    this.loadMapData();
  }

  initMap(): void {
    this.map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  async loadMapData(): Promise<void> {
    const toastId = toast.loading(this.translate.instant('COMMON.LOADING'));

    await new Promise<void>((resolve) => setTimeout(resolve, 500));

    this.dataService.getMapData().pipe(
      tap((res: any) => {
        const data = res.data;

        if (this.geoJsonLayer) {
          this.geoJsonLayer.remove();
        }
        if (this.circlesLayer) {
          this.circlesLayer.clearLayers();
        }

        this.circlesLayer = L.layerGroup().addTo(this.map!);

        return from(fetch('assets/custom.geo.json').then(res => res.json())).pipe(
          tap(geoData => {
            if (!geoData.features?.length) {
              throw new Error('GeoJSON features missing or empty');
            }

            this.geoJsonLayer = L.geoJSON(geoData, {
              style: (feature: any) => {
                const countryCode = feature.properties.iso_a2_eh?.toUpperCase();
                const countryData = data.find((d: any) => d.country_code === countryCode);
                const value = this.selectedMetric === 'cases'
                  ? countryData?.case_rate_percent
                  : countryData?.death_rate_percent;

                return {
                  fillColor: this.utilService.getColor(value),
                  fillOpacity: 0.7,
                  weight: 1,
                  color: '#ccc'
                };
              }
            }).addTo(this.map!);

            geoData.features.forEach((feature: any) => {
              const countryCode = feature.properties.iso_a2_eh?.toUpperCase();
              const countryData = data.find((d: any) => d.country_code === countryCode);

              if (!countryData) {
                console.warn(`No data for country code: ${countryCode}`);
                return;
              }

              if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
                const center = this.utilService.getFeatureCenter(feature);
                const radius = this.selectedMetric === 'cases'
                  ? this.utilService.scaleRadius(countryData.total_cases)
                  : this.utilService.scaleRadius(countryData.total_deaths);

                if (radius > 0) {
                  const tooltipContent = this.selectedMetric === 'cases'
                    ? `
                    <strong>${countryData.country_name}</strong><br>
                    ${this.translate.instant('CARTOGRAPHY.TOOLTIP.CONFIRMED_CASES')}: ${countryData.total_cases.toLocaleString()}<br>
                    ${this.translate.instant('CARTOGRAPHY.TOOLTIP.POPULATION')}: ${countryData.population?.toLocaleString()}<br>
                    ${this.translate.instant('CARTOGRAPHY.TOOLTIP.CASE_RATE')}: ${countryData.case_rate_percent?.toFixed(2)}${this.translate.instant('CARTOGRAPHY.TOOLTIP.PERCENT_SIGN')}
                  `
                    : `
                    <strong>${countryData.country_name}</strong><br>
                    ${this.translate.instant('CARTOGRAPHY.TOOLTIP.DEATHS')}: ${countryData.total_deaths.toLocaleString()}<br>
                    ${this.translate.instant('CARTOGRAPHY.TOOLTIP.POPULATION')}: ${countryData.population?.toLocaleString()}<br>
                    ${this.translate.instant('CARTOGRAPHY.TOOLTIP.DEATH_RATE')}: ${countryData.death_rate_percent?.toFixed(2)}${this.translate.instant('CARTOGRAPHY.TOOLTIP.PERCENT_SIGN')}
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

            toast.success(this.translate.instant('COMMON.LOADED'), {id: toastId});
          })
        ).toPromise();
      }),
      catchError(error => {
        console.error('Error loading map data:', error);
        toast.error(this.translate.instant('COMMON.ERROR'), {id: toastId});
        return throwError(() => error);
      })
    ).subscribe();
  }
}
