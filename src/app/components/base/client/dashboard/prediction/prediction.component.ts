import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {toast} from 'ngx-sonner';

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

    const toastId = toast.loading('Lancement de la prédiction...');
    this.closeModal();

    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    this.dataService.getPredictedData(this.selectedCountry, this.startDate).subscribe({
      next: (result) => {
        this.predictionData = result;
        toast.success('Prediction effectuée avec succès.', {id: toastId});
      },
      error: (err) => {
        toast.error('Erreur lors de la prédiction.', {id: toastId});
      },
      complete: () => {
        this.selectedCountry = '';
        this.startDate = '';
      }
    });
  }
}
