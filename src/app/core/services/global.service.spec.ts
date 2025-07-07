import { TestBed } from '@angular/core/testing';
import { GlobalService } from './global.service';

describe('ExampleService', () => {
  let service: GlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should add two numbers correctly', () => {
      expect(service.add(2, 3)).toBe(5);
      expect(service.add(-1, 1)).toBe(0);
      expect(service.add(0, 0)).toBe(0);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(service.isEven(2)).toBe(true);
      expect(service.isEven(0)).toBe(true);
      expect(service.isEven(-4)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(service.isEven(1)).toBe(false);
      expect(service.isEven(-3)).toBe(false);
    });
  });
});
