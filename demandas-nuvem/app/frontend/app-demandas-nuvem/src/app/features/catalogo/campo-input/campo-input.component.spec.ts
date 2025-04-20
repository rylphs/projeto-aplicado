import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoInputComponent } from './campo-input.component';

describe('CampoInputComponent', () => {
  let component: CampoInputComponent;
  let fixture: ComponentFixture<CampoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
