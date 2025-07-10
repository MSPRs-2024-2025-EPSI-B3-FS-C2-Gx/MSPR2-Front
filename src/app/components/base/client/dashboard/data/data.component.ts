import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';
import {NgForOf, NgIf} from '@angular/common';
import {toast} from 'ngx-sonner';
import {FormsModule} from '@angular/forms';
import {catchError, tap, throwError} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-data',
  imports: [
    SidebarComponent,
    NgForOf,
    FormsModule,
    NgIf,
    TranslateModule
  ],
  templateUrl: './data.component.html',
})
export class DataComponent implements OnInit {
  rawData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  selectedCountry: string = 'all';
  countries: { country_name: string; country_short_code: string }[] = [];
  limit: number = 10;

  constructor(public dataService: DataService, private translate: TranslateService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.loadCountries();
    this.loadData();
  }

  loadCountries(): void {
    this.dataService.getAllCountry().subscribe((res: any) => {
      this.countries = res || [];
    });
  }

  async loadData(page: number = 1): Promise<void> {
    const toastId = toast.loading(this.translate.instant('COMMON.LOADING'));

    await new Promise<void>((resolve) => setTimeout(resolve, 100));

    const data$ = this.selectedCountry === 'all'
      ? this.dataService.getAllBruteData(page, this.limit)
      : this.dataService.getAllBruteDataByCountry(this.selectedCountry);

    data$.pipe(
      tap((res: any) => {
        if (this.selectedCountry === 'all') {
          this.rawData = res.data || [];
          this.currentPage = page;
          this.totalPages = res.total_pages || 1;
        } else {
          this.rawData = res || [];
          this.currentPage = 1;
          this.totalPages = 1;
        }
        toast.success(this.translate.instant('COMMON.LOADED'), {id: toastId});
      }),
      catchError(error => {
        console.error('Error loading data:', error);
        toast.error(this.translate.instant('COMMON.ERROR'), {id: toastId});
        return throwError(() => error);
      })
    ).subscribe();
  }

  async goToPreviousPage(): Promise<void> {
    if (this.currentPage > 1) {
      await this.loadData(this.currentPage - 1);
    }
  }

  async goToNextPage(): Promise<void> {
    if (this.currentPage < this.totalPages) {
      await this.loadData(this.currentPage + 1);
    }
  }

}
