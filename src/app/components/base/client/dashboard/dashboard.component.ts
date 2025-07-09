import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../../include/client/sidebar/sidebar.component';
import {toast} from 'ngx-sonner';
import {DataService} from '../../../../services/data/data.service';
import {RouterLink} from '@angular/router';
import {catchError, forkJoin, tap, throwError} from 'rxjs';
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import {NgForOf} from '@angular/common';
import {UtilService} from '../../../../services/util/util.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

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
  standalone: true,
  imports: [
    SidebarComponent,
    RouterLink,
    NgForOf,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  totalCases: number = 0;
  totalVaccinations: number = 0;
  totalDeaths: number = 0;
  top5Cases: any[] = [];
  top5Deaths: any[] = [];
  selectedMetric: 'cases' | 'deaths' = 'deaths';

  casesChart: Chart | null = null;
  vaccinationChart: Chart | null = null;

  constructor(
    public dataService: DataService,
    public utilService: UtilService,
    private translate: TranslateService
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  onLeaderMetricChange(event: any): void {
    this.selectedMetric = event.target.value === 'cases' ? 'cases' : 'deaths';
    console.log('Métrique sélectionnée :', this.selectedMetric);
  }

  renderCasesChart(data: { date: string, total_cases: number }[]): void {
    const labels = data.map(d => d.date);
    const values = data.map(d => d.total_cases);

    const canvas = document.getElementById('casesChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (this.casesChart) {
      this.casesChart.destroy();
    }

    this.casesChart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: this.translate.instant('DASHBOARD.CHARTS.CASES_TITLE'),
          data: values,
          borderColor: 'rgb(59, 130, 246)',
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

  renderVaccinationChart(data: { date: string, total_daily_vaccinations: number }[]): void {
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
          label: this.translate.instant('DASHBOARD.CHARTS.VACCINATIONS_TITLE'),
          data: values,
          borderColor: 'rgb(16, 185, 129)',
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

  private async loadData(): Promise<void> {
    const toastId = toast.loading(this.translate.instant('COMMON.LOADING'));

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
        tap(({cases, vaccines, deaths, evolution, vaccineEvo, top5}) => {
          // @ts-expect-error Cast to number
          this.totalCases = Number(cases[0].total_weekly_cases);
          // @ts-expect-error Cast to number
          this.totalVaccinations = Number(vaccines[0].total_reported_shots);
          // @ts-expect-error Cast to number
          this.totalDeaths = Number(deaths[0].total_weekly_deaths);
          this.renderCasesChart(evolution.data);
          this.renderVaccinationChart(vaccineEvo.data);
          this.top5Cases = top5.top5_cases;
          this.top5Deaths = top5.top5_deaths;
          toast.success(this.translate.instant('COMMON.LOADED'), {id: toastId});
        }),
        catchError(error => {
          toast.error(this.translate.instant('COMMON.ERROR'), {id: toastId});
          return throwError(() => error);
        })
      )
      .subscribe();
  }
}
