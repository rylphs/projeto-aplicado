import { InstanciaServico, Servico, ServicoService } from './../../catalogo/servico.service';
import { DemandaService } from './../demanda.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Component, inject} from '@angular/core';
import { FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { Anexo, Demanda } from '../demanda-model';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { v4 as uuidv4 } from 'uuid';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-preencher-demanda',
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatStepperModule,
    MatButtonModule, MatTableModule, MatIconModule, MatCardModule],
  templateUrl: './preencher-demanda.component.html',
  styleUrl: './preencher-demanda.component.css'
})
export class PreencherDemandaComponent {
  demanda!: Demanda;
  dataSource!: MatTableDataSource<Anexo>;
  dataSourceServicos!: MatTableDataSource<InstanciaServico>;
  columns = ["nome", "tipo", "actions"]
  servicos: Servico[] = [];
  colunasServicos = ["label", "quantidade", "actions"];

  constructor(route: ActivatedRoute, private demandaService: DemandaService,
    private servicoService: ServicoService, private router:Router){

    let id = route.snapshot.params["id"];
    id = "67fad77f8951ffc2c58f25e4"; //TODO remover
    this.carregarDemanda(id);
    this.carregarServicos();
  }

  carregarDemanda(id:string){
    if(this.demandaService.selectedDemanda()._id){
      this.demanda = this.demandaService.selectedDemanda();
      this.dataSource = new MatTableDataSource(this.demanda.anexos);
      this.dataSourceServicos = new MatTableDataSource(this.demanda.servicos)
      return;
    }
    if(id){
      this.demandaService.getDemanda(id).subscribe((response)=>{
        if (response.statusCode < 400){
          this.demanda = Demanda.fromData(response.message);
          this.demanda.anexos = [];
          this.dataSource = new MatTableDataSource(this.demanda.anexos);
          this.dataSourceServicos = new MatTableDataSource(this.demanda.servicos)

          this.demandaService.selectedDemanda.set(this.demanda);
        }
      })
    }
  }

  carregarServicos(){
    this.servicoService.getAllServicos().subscribe((response)=>{ console.log(response)
      if (response.statusCode < 400){
        this.servicos = response.message;
        console.log(this.servicos);
      }
    })
  }

  adicionarServico(servico:Servico){
    let instancia = servico.criarInstancia();
    console.log(instancia);
    this.demanda.servicos.push(instancia);

    this.dataSourceServicos.data = this.demanda.servicos;
    this.router.navigate(["formulario","servico"], {state: {servico:instancia}});
  }

  removerAnexo(anexo:Anexo){
    this.demanda.anexos = this.demanda.anexos.filter((el)=>el.nome != anexo.nome);
    this.dataSource.data = this.demanda.anexos;
  }

  adicionarAnexo(event: any){
    let file:File = event.target.files[0];
    const id = uuidv4();
    this.demanda.anexos.push({id: id, nome: file.name, tipo: file.type, file: file})
    this.dataSource.data = this.demanda.anexos;
  }
}
