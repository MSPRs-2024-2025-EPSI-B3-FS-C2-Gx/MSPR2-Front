import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartographyComponent } from './cartography.component';

describe('CartographyComponent', () => {
  let component: CartographyComponent;
  let fixture: ComponentFixture<CartographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartographyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
