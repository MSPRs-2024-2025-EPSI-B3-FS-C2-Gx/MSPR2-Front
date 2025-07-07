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
      return this.getPolygonCenter(coords[0]);
    } else if (feature.geometry.type === 'MultiPolygon') {
      let totalArea = 0;
      let weightedLat = 0;
      let weightedLng = 0;

      coords.forEach((polygonGroup: number[][][]) => {
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
    const total = polygon.reduce(
      (acc, coord) => [acc[0] + coord[1], acc[1] + coord[0]],
      [0, 0]
    );
    const lat = total[0] / polygon.length;
    const lng = total[1] / polygon.length;
    return [lat, lng];
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
