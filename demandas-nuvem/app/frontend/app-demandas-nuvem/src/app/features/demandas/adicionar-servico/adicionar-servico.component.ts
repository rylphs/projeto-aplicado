import { MessageService } from './../../../shared/message/message.service';
import { Demanda, StatusDemanda } from './../demanda-model';
import { DemandaService } from './../demanda.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { InstanciaServico, Servico } from '../../catalogo/servico.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CampoInputComponent } from '../../catalogo/campo-input/campo-input.component';

@Component({
  selector: 'app-adicionar-servico',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, CampoInputComponent,
    FormsModule, MatTooltipModule, MatIconModule, MatSelectModule, MatCheckboxModule, MatInputModule],
  templateUrl: './adicionar-servico.component.html',
  styleUrl: './adicionar-servico.component.css'
})
export class AdicionarServicoComponent {
  instancia!: InstanciaServico;
  editar: boolean = false;
  demanda!: Demanda;

  constructor(private router: Router, private demandaService: DemandaService, route:ActivatedRoute,
    private messageService: MessageService) {

    let state = this.router.getCurrentNavigation()?.extras?.state;
    this.instancia = new InstanciaServico();
    if (state && state["servico"]) {
      this.instancia = state["servico"];
      if (!state["novo"]) {
        this.editar = true;
      }
    }
    else {
      const idDemanda = route.snapshot.params["id"];
      const idServico = route.snapshot.params["idServico"];
      const indice = route.snapshot.params["indice"];
      this.editar = !!indice;
      this.demandaService.getDemanda(idDemanda).subscribe(response => {
        if(response.statusCode < 400){
          this.demanda = response.message;
          this.demandaService.selectedDemanda.set(this.demanda);
          this.instancia = this.demanda.servicos.find(servico => servico.id == indice) || new InstanciaServico();
          console.log(this.instancia);
        }

      })
    }
  }

  adicionar() {
    this.demandaService.atualizarDemanda(this.demanda).subscribe(response => {
      if(response.statusCode < 400){
        this.messageService.getSubject("demanda").next({
          message: `Serviço ${this.instancia.metaData.label} atualizado com sucesso`
        })
        this.router.navigate(["formulario", this.demandaService.selectedDemanda()._id, 1])
      }
    })

    //this.router.navigate(["formulario", this.demandaService.selectedDemanda()._id, 1])
  }

  cancelar(){
    this.router.navigate(["formulario", this.demandaService.selectedDemanda()._id, 1])
  }

  get readonly(): boolean {
    return this.demandaService.selectedDemanda()?.status != StatusDemanda.EM_PREENCHIMENTO;
  }

}
