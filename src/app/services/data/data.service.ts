import {Injectable} from '@angular/core';
import {toast} from 'ngx-sonner';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL: string = 'http://127.0.0.1:5001/api';
  isRefreshing = false;

  constructor(private http: HttpClient) {
  }

  refresh(): void {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    const lastToast = toast.loading('Actualisation...');
    setTimeout(() => {
      this.isRefreshing = false;
      toast.success('Actualisation effectuée !', {
        id: lastToast
      });
    }, 1000);
  }

  export(): void {
    toast.error('Fonctionnalité non disponible.');
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
}
