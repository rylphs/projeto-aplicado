import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarUsuarioComponent } from './selecionar-usuario.component';

describe('SelecionarUsuarioComponent', () => {
  let component: SelecionarUsuarioComponent;
  let fixture: ComponentFixture<SelecionarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecionarUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecionarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
