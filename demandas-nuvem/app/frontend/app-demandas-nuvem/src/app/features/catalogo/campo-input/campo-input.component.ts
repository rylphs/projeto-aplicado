import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InstanciaCampo } from '../campo.model';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-campo-input',
  imports: [MatFormField, MatIconModule, MatTooltipModule, FormsModule, MatSelectModule, MatInputModule],
  templateUrl: './campo-input.component.html',
  styleUrl: './campo-input.component.css'
})
export class CampoInputComponent {
  @Input() campos!: InstanciaCampo[];
  @Input() readonly!: boolean;

}
