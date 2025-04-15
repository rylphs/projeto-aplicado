import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { InstanciaServico } from '../../catalogo/servico.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adicionar-servico',
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './adicionar-servico.component.html',
  styleUrl: './adicionar-servico.component.css'
})
export class AdicionarServicoComponent {
  servico!: InstanciaServico;

  constructor(private route: Router){
    let state = this.route.getCurrentNavigation()?.extras?.state;
    if(state && state["servico"]){
      this.servico = state["servico"];
    }
    console.log(this.servico);
  }

}
