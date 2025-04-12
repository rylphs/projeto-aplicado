import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarDemandaComponent } from './criar-demanda.component';

describe('CriarDemandaComponent', () => {
  let component: CriarDemandaComponent;
  let fixture: ComponentFixture<CriarDemandaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarDemandaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarDemandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
