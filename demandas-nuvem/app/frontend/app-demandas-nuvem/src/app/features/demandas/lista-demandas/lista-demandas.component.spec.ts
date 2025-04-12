import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDemandasComponent } from './lista-demandas.component';

describe('ListaDemandasComponent', () => {
  let component: ListaDemandasComponent;
  let fixture: ComponentFixture<ListaDemandasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaDemandasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDemandasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
