import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from '../../../../include/client/sidebar/sidebar.component';
import {DataService} from '../../../../../services/data/data.service';
import {NgForOf, NgIf} from '@angular/common';
import {toast} from 'ngx-sonner';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-data',
  imports: [
    SidebarComponent,
    NgForOf,
    FormsModule,
    NgIf
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

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
    this.loadCountries();
    this.loadData();
  }

  loadCountries() {
    this.dataService.getAllCountry().subscribe((res: any) => {
      this.countries = res || [];
    });
  }

  async loadData(page: number = 1) {
    const toastId = toast.loading('Chargement des données...');

    await new Promise<void>((resolve) => setTimeout(resolve, 100));

    if (this.selectedCountry === 'all') {
      this.dataService.getAllBruteData(page, this.limit).subscribe((res: any) => {
        this.rawData = res.data || [];
        this.currentPage = page;
        this.totalPages = res.total_pages || 1;
        toast.success('Données chargées avec succès.', {id: toastId});
      });
    } else {
      this.dataService.getAllBruteDataByCountry(this.selectedCountry).subscribe((res: any) => {
        this.rawData = res || [];
        this.currentPage = 1;
        this.totalPages = 1;
        toast.success('Données chargées avec succès.', {id: toastId});
      });
    }
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
