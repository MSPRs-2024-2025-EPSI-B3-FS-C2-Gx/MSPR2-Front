import {Component} from '@angular/core';
import {SidebarComponent} from '../../../include/client/sidebar/sidebar.component';
import {toast} from 'ngx-sonner';
import {DataService} from '../../../../services/data/data.service';
import {RouterLink} from '@angular/router';
import {catchError, finalize, forkJoin} from 'rxjs';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Filler,
  CategoryScale,
  Legend
} from 'chart.js';
import {NgForOf} from '@angular/common';
import {UtilService} from '../../../../services/util/util.service';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Filler,
  Legend
);

@Component({
  selector: 'app-dashboard',
  imports: [
    SidebarComponent,
    RouterLink,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  totalCases: number = 0;
  totalVaccinations: number = 0;
  totalDeaths: number = 0;
  top5Cases: any[] = [];
  top5Deaths: any[] = [];
  selectedMetric: 'cases' | 'deaths' = 'deaths';

  casesChart: Chart | null = null;
  vaccinationChart: Chart | null = null;

  constructor(public dataService: DataService, public utilService: UtilService) {
    this.loadData();
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  onLeaderMetricChange(event: any) {
    this.selectedMetric = event.target.value === 'cases' ? 'cases' : 'deaths';
    console.log('Métrique sélectionnée :', this.selectedMetric);
  }

  private async loadData(): Promise<void> {
    const toastId = toast.loading('Chargement des données...');

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200)
    });

    forkJoin({
      cases: this.dataService.getTotalCases(),
      vaccines: this.dataService.getTotalVaccinations(),
      deaths: this.dataService.getTotalDeaths(),
      evolution: this.dataService.getEvolutionGraph(),
      vaccineEvo: this.dataService.getVaccineEvoGraph(),
      top5: this.dataService.getTopFive()
    })
      .pipe(
        catchError(error => {
          toast.error('Erreur lors du chargement des données.', {id: toastId});
          throw error;
        }),
        finalize(() => {
          toast.success('Données chargées avec succès.', {id: toastId});
        })
      )
      .subscribe(({cases, vaccines, deaths, evolution, vaccineEvo, top5}) => {
        // @ts-ignore
        this.totalCases = Number(cases[0].total_weekly_cases);
        // @ts-ignore
        this.totalVaccinations = Number(vaccines[0].total_reported_shots);
        // @ts-ignore
        this.totalDeaths = Number(deaths[0].total_weekly_deaths);
        this.renderCasesChart(evolution.data);
        this.renderVaccinationChart(vaccineEvo.data);
        this.top5Cases = top5.top5_cases;
        this.top5Deaths = top5.top5_deaths;
      });
  }

  renderCasesChart(data: { date: string, total_cases: number }[]) {
    const labels = data.map(d => d.date);
    const values = data.map(d => d.total_cases);

    const canvas = document.getElementById('casesChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (this.casesChart) {
      this.casesChart.destroy(); // détruit le précédent si existant
    }

    this.casesChart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Total de cas',
          data: values,
          borderColor: 'rgb(59, 130, 246)', // bleu
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cas cumulés'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  renderVaccinationChart(data: { date: string, total_daily_vaccinations: number }[]) {
    const labels = data.map(d => d.date);
    const values = data.map(d => d.total_daily_vaccinations);

    const canvas = document.getElementById('vaccinationChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (this.vaccinationChart) {
      this.vaccinationChart.destroy();
    }

    this.vaccinationChart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Vaccinations journalières',
          data: values,
          borderColor: 'rgb(16, 185, 129)', // vert
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Vaccinations'
            },
            beginAtZero: true
          }
        }
      }
    });
  }
}
