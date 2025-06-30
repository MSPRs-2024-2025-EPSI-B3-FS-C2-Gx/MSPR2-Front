import { Injectable } from '@angular/core';
import {toast} from 'ngx-sonner';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL: string = 'http://localhost:8000';
  isRefreshing = false;

  constructor(private http: HttpClient) { }

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
    return this.http.get<number>(`${this.API_URL}/total_vaccinations`);
  }

  getTotalDeaths(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total_deaths`);
  }
}
