import {Injectable} from '@angular/core';
import {toast} from 'ngx-sonner';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL: string = 'https://api-mspr-2-kldok.gaetandev.fr/api';
  isRefreshing = false;

  constructor(private http: HttpClient, private translate: TranslateService) {
  }

  refresh(): void {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    const lastToast = toast.loading(this.translate.instant('COMMON.REFRESHING'));
    setTimeout(() => {
      this.isRefreshing = false;
      toast.success(this.translate.instant('COMMON.REFRESH_SUCCESS'), {
        id: lastToast
      });
    }, 1000);
  }

  export(): void {
    toast.error(this.translate.instant('COMMON.NO_AVAILABLE_FEATURE'));
  }

  getTotalCases(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total_cases`);
  }

  getTotalVaccinations(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total_vaccines`);
  }

  getTotalDeaths(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total_deaths`);
  }

  getEvolutionGraph(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/covid_cases_evolution`);
  }

  getVaccineEvoGraph(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/vaccinations_evolution`);
  }

  getTopFive(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/top5_summary`);
  }

  getMapData(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/country_covid_rates`);
  }

  getAllBruteData(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/weekly_statistics_total?limit=${limit}&page=${page}`);
  }

  getAllBruteDataByCountry(country: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/weekly_statistics_by_country?country_code=${country}`);
  }

  getAllCountry(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/country`);
  }

  getPredictedData(country: string, date: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/predict_cases?country=${country}&start_date=${date}`);
  }
}
