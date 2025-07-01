import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {toast} from 'ngx-sonner';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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

    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    forkJoin({
      prediction: this.dataService.getPredictedData(this.selectedCountry, this.startDate),
      realData: this.dataService.getAllBruteDataByCountry(countryCode)
    }).subscribe({
      next: ({ prediction, realData }) => {
        this.predictionData = prediction;
        this.realData = realData;

        setTimeout(() => this.renderChart(), 0);

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

  renderChart(): void {
    // @ts-ignore
    if (!this.predictionData?.predictions || !this.realData?.length) return;

    // @ts-ignore
    const predicted = this.predictionData.predictions;
    const real = this.realData;

    const allDatesSet = new Set<string>([
      ...predicted.map((p: any) => p.date),
      ...real.map(r => r.date)
    ]);

    const allDates = Array.from(allDatesSet).sort();

    const realCases = allDates.map(date => {
      const found = real.find((r: any) => r.date === date);
      return found ? found.confirmed_cases : null;
    });

    const predictedCases = allDates.map(date => {
      const found = predicted.find((p: any) => p.date === date);
      return found ? found.predicted_cases : null;
    });

    const ctx = document.getElementById('combinedChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: allDates,
        datasets: [
          {
            label: 'Cas réels',
            data: realCases,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            spanGaps: true
          },
          {
            label: 'Cas prédits',
            data: predictedCases,
            borderColor: '#F97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.3,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  }
}
