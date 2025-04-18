import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarCatalogoComponent } from './criar-catalogo.component';

describe('CriarCatalogoComponent', () => {
  let component: CriarCatalogoComponent;
  let fixture: ComponentFixture<CriarCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
