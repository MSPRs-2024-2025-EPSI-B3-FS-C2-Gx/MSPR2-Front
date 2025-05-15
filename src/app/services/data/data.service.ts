import { Injectable } from '@angular/core';
import {toast} from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  isRefreshing = false;

  constructor() { }

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
}
