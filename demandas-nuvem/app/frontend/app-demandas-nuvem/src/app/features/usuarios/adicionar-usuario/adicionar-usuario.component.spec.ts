import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarUsuarioComponent } from './adicionar-usuario.component';

describe('AdicionarUsuarioComponent', () => {
  let component: AdicionarUsuarioComponent;
  let fixture: ComponentFixture<AdicionarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
