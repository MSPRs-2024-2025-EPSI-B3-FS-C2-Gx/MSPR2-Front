import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchData = [
    {title: 'Tableau de bord', route: '/client', keywords: 'dashboard tableau bord accueil client overview'},
    {
      title: 'Profil',
      route: '/client/profile',
      keywords: 'profil profile utilisateur user compte informations personnelles'
    },
    {title: 'Paramètres', route: '/client/settings', keywords: 'paramètres settings configuration préférences options'},
    {
      title: 'Cartographie',
      route: '/client/cartography',
      keywords: 'cartographie carte map géographie localisation zones régions'
    },
    {title: 'Données', route: '/client/data', keywords: 'données data statistiques chiffres informations analytics'},
    {
      title: 'Prédictions',
      route: '/client/predictions',
      keywords: 'prédictions predictions analyse tendances futur modèles'
    },
    {title: 'Contact', route: '/contact', keywords: 'contact support aide assistance message'}
  ];

  constructor(private router: Router) {
  }

  search(query: string): any[] {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return this.searchData.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.keywords.toLowerCase().includes(lowerQuery)
    );
  }

  navigateToResult(result: any): void {
    this.router.navigateByUrl(result.route);
  }
}
