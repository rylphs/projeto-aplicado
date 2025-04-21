import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCampoInputComponent } from './dialog-campo-input.component';

describe('DialogCampoInputComponent', () => {
  let component: DialogCampoInputComponent;
  let fixture: ComponentFixture<DialogCampoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCampoInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCampoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
