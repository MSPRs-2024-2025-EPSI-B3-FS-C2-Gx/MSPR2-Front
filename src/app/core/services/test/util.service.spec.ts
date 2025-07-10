import { TestBed } from '@angular/core/testing';
import {UtilService} from '../../../services/util/util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCountryCode', () => {
    it('should return correct country code for known countries', () => {
      expect(service.getCountryCode('France')).toBe('fr');
      expect(service.getCountryCode('Germany')).toBe('de');
      expect(service.getCountryCode('United States of America')).toBe('us');
    });

    it('should return "un" for unknown countries', () => {
      expect(service.getCountryCode('Unknown Country')).toBe('un');
    });
  });

  describe('getColor', () => {
    it('should return correct color based on value', () => {
      expect(service.getColor(80)).toBe('#800026');  // > 75
      expect(service.getColor(60)).toBe('#BD0026');  // > 50
      expect(service.getColor(30)).toBe('#E31A1C');  // > 25
      expect(service.getColor(15)).toBe('#FC4E2A');  // > 10
      expect(service.getColor(7)).toBe('#FD8D3C');   // > 5
      expect(service.getColor(3)).toBe('#FEB24C');   // > 1
      expect(service.getColor(0.5)).toBe('#FFEDA0'); // <= 1
    });

    it('should return #ccc for null or undefined values', () => {
      // @ts-ignore - Testing with null/undefined
      expect(service.getColor(null)).toBe('#ccc');
      // @ts-ignore - Testing with null/undefined
      expect(service.getColor(undefined)).toBe('#ccc');
    });
  });

  describe('getPolygonCenter', () => {
    it('should calculate the center of a polygon', () => {
      // Carré de 2x2 centré en (1,1)
      const polygon = [
        [0, 0], // lng, lat
        [0, 2], // lng, lat
        [2, 2], // lng, lat
        [2, 0]  // lng, lat
      ];
      const center = service.getPolygonCenter(polygon);
      expect(center[0]).toBeCloseTo(1); // lat
      expect(center[1]).toBeCloseTo(1); // lng
    });
  });

  describe('getPolygonArea', () => {
    it('should calculate the area of a polygon', () => {
      // Carré de 2x2
      const polygon = [
        [0, 0], // lng, lat
        [0, 2], // lng, lat
        [2, 2], // lng, lat
        [2, 0]  // lng, lat
      ];
      const area = service.getPolygonArea(polygon);
      expect(area).toBe(4); // 2 * 2 = 4
    });
  });

  describe('getFeatureCenter', () => {
    it('should handle Polygon features', () => {
      const feature = {
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],   // lng, lat
              [0, 2],   // lng, lat
              [2, 2],   // lng, lat
              [2, 0],   // lng, lat
              [0, 0]    // lng, lat
            ]
          ]
        }
      };
      const center = service.getFeatureCenter(feature);
      // Le centre d'un carré de (0,0) à (2,2) devrait être (1,1)
      expect(center[0]).toBeCloseTo(1); // lat
      expect(center[1]).toBeCloseTo(1); // lng
    });

    it('should handle MultiPolygon features', () => {
      const feature = {
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [0, 0],   // lng, lat
                [0, 1],   // lng, lat
                [1, 1],   // lng, lat
                [1, 0],   // lng, lat
                [0, 0]    // lng, lat
              ]
            ],
            [
              [
                [1, 1],   // lng, lat
                [1, 2],   // lng, lat
                [2, 2],   // lng, lat
                [2, 1],   // lng, lat
                [1, 1]    // lng, lat
              ]
            ]
          ]
        }
      };
      const center = service.getFeatureCenter(feature);
      // Le centre pondéré devrait être (1, 1) car les deux carrés sont adjacents
      // et de même taille
      expect(center[0]).toBeCloseTo(1); // lat
      expect(center[1]).toBeCloseTo(1); // lng
    });

    it('should return [0, 0] for unknown geometry types', () => {
      const feature = {
        geometry: {
          type: 'Unknown',
          coordinates: []
        }
      };
      const center = service.getFeatureCenter(feature);
      expect(center).toEqual([0, 0]);
    });
  });

  describe('scaleRadius', () => {
    it('should return 0 for falsy values', () => {
      // @ts-ignore - Testing with null/undefined
      expect(service.scaleRadius(null)).toBe(0);
      // @ts-ignore - Testing with null/undefined
      expect(service.scaleRadius(undefined)).toBe(0);
      expect(service.scaleRadius(0)).toBe(0);
    });

    it('should return the square root of the value divided by 2000', () => {
      expect(service.scaleRadius(4000000)).toBeCloseTo(1, 5); // sqrt(4,000,000) / 2000 = 1
      expect(service.scaleRadius(1000000)).toBeCloseTo(0.5, 5); // sqrt(1,000,000) / 2000 = 0.5
    });
  });
});
