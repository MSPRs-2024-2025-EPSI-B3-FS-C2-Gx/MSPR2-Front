import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchData = [
    {
      title: 'Tableau de bord',
      route: '/client',
      keywords: 'tableau bord dashboard accueil client overview synthèse résumé statistiques globales vue générale monitoring'
    },
    {
      title: 'Profil',
      route: '/client/profile',
      keywords: 'profil profile utilisateur user compte informations personnelles identité paramètres accès sécurité'
    },
    {
      title: 'Paramètres',
      route: '/client/settings',
      keywords: 'paramètres settings configuration préférences options système interface personnalisation langue thème'
    },
    {
      title: 'Cartographie',
      route: '/client/cartography',
      keywords: 'cartographie carte map géographie localisation pays régions zones territoires visualisation spatial covid monde'
    },
    {
      title: 'Données',
      route: '/client/data',
      keywords: 'données data statistiques chiffres informations analytics export table historique csv json sources'
    },
    {
      title: 'Prédictions',
      route: '/client/predictions',
      keywords: 'prédictions predictions prévisions analyse tendances futur projection modèles machine learning IA courbes'
    },
    {
      title: 'Contact',
      route: '/contact',
      keywords: 'contact support aide assistance message question formulaire email téléphone bug problème retour'
    }
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
