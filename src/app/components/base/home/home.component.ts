import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

type FeatureKey = 'STATS' | 'AI' | 'MAPPING' | 'ALERTS' | 'HISTORY' | 'EXPORT';
type TestimonialKey = 'EPIDEMIOLOGIST' | 'JOURNALIST' | 'HEALTH_OFFICER';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Clés pour les fonctionnalités
  featureKeys: FeatureKey[] = ['STATS', 'AI', 'MAPPING', 'ALERTS', 'HISTORY', 'EXPORT'];

  // Clés pour les témoignages
  testimonialKeys: TestimonialKey[] = ['EPIDEMIOLOGIST', 'JOURNALIST', 'HEALTH_OFFICER'];

  // Données pour les statistiques
  stats = [
    { id: 'confirmed', value: '689M+', icon: 'fas fa-procedures', color: 'red' },
    { id: 'vaccinations', value: '13.1B+', icon: 'fas fa-syringe', color: 'blue' },
    { id: 'recovered', value: '662M+', icon: 'fas fa-heartbeat', color: 'green' },
    { id: 'deaths', value: '6.88M+', icon: 'fas fa-cross', color: 'gray' }
  ];

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  // Méthodes utilitaires pour le template
  getFeatureIcon(key: FeatureKey): string {
    const icons: Record<FeatureKey, string> = {
      'STATS': 'fas fa-chart-line',
      'AI': 'fas fa-robot',
      'MAPPING': 'fas fa-map-marked-alt',
      'ALERTS': 'fas fa-bell',
      'HISTORY': 'fas fa-database',
      'EXPORT': 'fas fa-file-export'
    };
    return icons[key] || '';
  }

  getTestimonialImage(key: TestimonialKey): string {
    const images: Record<TestimonialKey, string> = {
      'EPIDEMIOLOGIST': 'women/32',
      'JOURNALIST': 'men/54',
      'HEALTH_OFFICER': 'men/67'
    };
    return `https://randomuser.me/api/portraits/${images[key]}.jpg`;
  }
}
