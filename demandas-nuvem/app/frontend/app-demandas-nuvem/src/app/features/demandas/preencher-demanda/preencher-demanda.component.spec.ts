import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreencherDemandaComponent } from './preencher-demanda.component';

describe('PreencherDemandaComponent', () => {
  let component: PreencherDemandaComponent;
  let fixture: ComponentFixture<PreencherDemandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreencherDemandaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreencherDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
