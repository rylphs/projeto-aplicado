import { StatusDemanda } from './../demanda-model';
import { DemandaService } from './../demanda.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { InstanciaServico } from '../../catalogo/servico.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-adicionar-servico',
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormsModule, MatTooltipModule, MatIconModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './adicionar-servico.component.html',
  styleUrl: './adicionar-servico.component.css'
})
export class AdicionarServicoComponent {
  servico!: InstanciaServico;
  editar: boolean = false;

  constructor(private router: Router, private demandaService: DemandaService, route:ActivatedRoute) {
    let state = this.router.getCurrentNavigation()?.extras?.state;
    if (state && state["servico"]) {
      this.servico = state["servico"];
      if (!state["novo"]) {
        this.editar = true;
      }
    }
    console.log(this.servico);
  }

  adicionar() {
    if (!this.editar) {
      this.demandaService.selectedDemanda().servicos.push(this.servico)
    }

    this.atualizarResumo();
    this.router.navigate(["formulario", this.demandaService.selectedDemanda()._id, 1])
  }

  atualizarResumo() {
    this.servico.resumo = this.servico.camposResumo.map((nomeCampo) => {
      let campo = this.servico.campos.find((campo) => campo.nome == nomeCampo)
      return campo ? campo.label + "=" + campo.value : "";
    }).join(",");
  }

  cancelar(){
    this.router.navigate(["formulario", this.demandaService.selectedDemanda()._id, 1])
  }

  get readonly(): boolean {
    return this.demandaService.selectedDemanda()?.status != StatusDemanda.EM_PREENCHIMENTO;
  }

}
