import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoServicoComponent } from './campo-servico.component';

describe('CampoServicoComponent', () => {
  let component: CampoServicoComponent;
  let fixture: ComponentFixture<CampoServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoServicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampoServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
