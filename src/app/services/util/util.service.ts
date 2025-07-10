import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  getCountryCode(name: string): string {
    const countryCodes: Record<string, string> = {
      'United States of America': 'us',
      'Brazil': 'br',
      'India': 'in',
      'Russian Federation': 'ru',
      'Mexico': 'mx',
      'China': 'cn',
      'France': 'fr',
      'Germany': 'de'
    };

    return countryCodes[name] || 'un';
  }

  getColor(value: number): string {
    if (!value) return '#ccc';
    return value > 75 ? '#800026' :
      value > 50 ? '#BD0026' :
        value > 25 ? '#E31A1C' :
          value > 10 ? '#FC4E2A' :
            value > 5 ? '#FD8D3C' :
              value > 1 ? '#FEB24C' :
                '#FFEDA0';
  }

  getFeatureCenter(feature: any): [number, number] {
    const coords = feature.geometry.coordinates;

    if (feature.geometry.type === 'Polygon') {
      // Pour un Polygon, les coordonnées sont déjà au bon niveau
      return this.getPolygonCenter(coords[0]);
    } else if (feature.geometry.type === 'MultiPolygon') {
      let totalArea = 0;
      let weightedLat = 0;
      let weightedLng = 0;

      coords.forEach((polygonGroup: number[][][]) => {
        // Pour un MultiPolygon, chaque groupe contient un tableau de polygones,
        // où le premier polygone est l'extérieur et les suivants sont des trous
        const polygon = polygonGroup[0];
        const area = this.getPolygonArea(polygon);
        const center = this.getPolygonCenter(polygon);

        weightedLat += center[0] * area;
        weightedLng += center[1] * area;
        totalArea += area;
      });

      if (totalArea === 0) return [0, 0];

      return [weightedLat / totalArea, weightedLng / totalArea];
    }

    return [0, 0];
  }

  getPolygonCenter(polygon: number[][]): [number, number] {
    // Calcul du centre de gravité du polygone
    // Utilisation de la formule du centre de gravité d'un polygone
    let x = 0;
    let y = 0;
    let signedArea = 0;

    // Le polygone doit être fermé (premier point = dernier point)
    const n = polygon.length - 1;

    for (let i = 0; i < n; i++) {
      const x0 = polygon[i][0];
      const y0 = polygon[i][1];
      const x1 = polygon[i + 1][0];
      const y1 = polygon[i + 1][1];

      const a = x0 * y1 - x1 * y0;
      signedArea += a;
      x += (x0 + x1) * a;
      y += (y0 + y1) * a;
    }

    signedArea *= 0.5;
    x /= (6 * signedArea);
    y /= (6 * signedArea);

    // Retourne [lat, lng]
    return [y, x];
  }

  getPolygonArea(polygon: number[][]): number {
    let area = 0;
    const len = polygon.length;
    for (let i = 0; i < len; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[(i + 1) % len];
      area += (x1 * y2 - x2 * y1);
    }
    return Math.abs(area / 2);
  }

  scaleRadius(value: number): number {
    if (!value) return 0;
    return Math.sqrt(value) / 2000;
  }

}
