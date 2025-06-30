import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  constructor() { }

  add(a: number, b: number): number {
    return a + b;
  }

  isEven(num: number): boolean {
    return num % 2 === 0;
  }
}
