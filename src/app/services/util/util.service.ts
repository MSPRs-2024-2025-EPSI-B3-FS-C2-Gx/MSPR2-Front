import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getCountryCode(name: string): string {
    const countryCodes: { [key: string]: string } = {
      'United States of America': 'us',
      'Brazil': 'br',
      'India': 'in',
      'Russian Federation': 'ru',
      'Mexico': 'mx',
      'China': 'cn',
      'France': 'fr',
      'Germany': 'de'
      // ajoute d’autres au besoin
    };

    return countryCodes[name] || 'un'; // code 'un' pour inconnu
  }

  getColor(value: number = 0): string {
    if (value > 70) return '#084081';
    if (value > 60) return '#0868ac';
    if (value > 50) return '#2b8cbe';
    if (value > 40) return '#4eb3d3';
    if (value > 30) return '#7bccc4';
    if (value > 20) return '#a8ddb5';
    if (value > 10) return '#ccebc5';
    return '#f7fcf0';
  }

}
