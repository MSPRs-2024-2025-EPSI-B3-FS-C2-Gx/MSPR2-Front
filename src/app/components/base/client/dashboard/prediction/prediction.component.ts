import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {toast} from 'ngx-sonner';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-prediction',
  imports: [
    SidebarComponent,
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './prediction.component.html'
})
export class PredictionComponent implements OnInit {
  modalOpen = false;
  countries: any[] = [];
  selectedCountry: string = '';
  startDate: string = '';

  predictionData: any[] = [];
  realData: any[] = [];

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadCountries();
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  loadCountries() {
    this.dataService.getAllCountry().subscribe((res: any) => {
      this.countries = res;
    });
  }

  async launchAnalysis(): Promise<void> {
    if (!this.selectedCountry || !this.startDate) return;

    const selected = this.countries.find((c: any) => c.country_name === this.selectedCountry);
    if (!selected) {
      toast.error('Pays sélectionné invalide.');
      return;
    }

    const countryCode: string = selected.country_short_code;
    const toastId = toast.loading('Lancement de la prédiction...');
    this.closeModal();

    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    forkJoin({
      prediction: this.dataService.getPredictedData(this.selectedCountry, this.startDate),
      realData: this.dataService.getAllBruteDataByCountry(countryCode)
    }).subscribe({
      next: ({ prediction, realData }) => {
        this.predictionData = prediction;
        this.realData = realData;
        toast.success('Prédiction effectuée avec succès.', { id: toastId });
      },
      error: () => {
        toast.error('Erreur lors de la prédiction.', { id: toastId });
      },
      complete: () => {
        this.selectedCountry = '';
        this.startDate = '';
      }
    });
  }
}
