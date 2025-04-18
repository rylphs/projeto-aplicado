import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCatalogoComponent } from './lista-catalogo.component';

describe('ListaCatalogoComponent', () => {
  let component: ListaCatalogoComponent;
  let fixture: ComponentFixture<ListaCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
