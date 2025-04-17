import { InstanciaServico, Servico, ServicoService } from './../../catalogo/servico.service';
import { DemandaService } from './../demanda.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Component, inject} from '@angular/core';
import { FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { Anexo, Demanda, StatusDemanda } from '../demanda-model';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { v4 as uuidv4 } from 'uuid';
import {MatCardModule} from '@angular/material/card';
import { FileService } from '../../../shared/file/file.service';
import { notify } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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
  colunasServicos = ["label", "quantidade", "resumo", "actions"];
  stepperIndex = 0;
  readonly dialog = inject(MatDialog);

  constructor(route: ActivatedRoute, private demandaService: DemandaService,
    private servicoService: ServicoService, private router:Router,
    private fileService:FileService){

    let id = route.snapshot.params["id"];
    let step = route.snapshot.params["step"];
    if(step) this.stepperIndex = Number.parseInt(step);
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
          this.demanda.anexos = this.demanda.anexos || [];
          this.dataSource = new MatTableDataSource(this.demanda.anexos);
          this.dataSourceServicos = new MatTableDataSource(this.demanda.servicos)

          this.demandaService.selectedDemanda.set(this.demanda);
          console.log(this.demanda);
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
    instancia.indice = this.demanda.servicos.length;
    this.dataSourceServicos.data = this.demanda.servicos;
    this.router.navigate(["formulario",this.demanda._id,"servico"], {state: {servico:instancia, novo:true}});
  }

  editarServico(instancia:InstanciaServico){
    this.router.navigate(["formulario",this.demanda._id, "servico"], {state: {servico:instancia, novo:false}});
  }

  removerServico(instancia:InstanciaServico){
    let indice = instancia.indice;
    this.demanda.servicos.splice(indice, 1);
    this.dataSourceServicos.data = this.demanda.servicos;
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

  salvarDemanda(){
    const anexos = this.demanda.anexos;
    for(let i in anexos){
      if(anexos[i].file){
        this.fileService.uploadAnexo(anexos[i].id, anexos[i].file).subscribe(console.log);
        anexos[i].file = undefined;
      }
    }
    this.demanda.status = StatusDemanda.PREENCHIDA;
    this.demandaService.atualizarDemanda(this.demanda).subscribe(()=>this.exibirMensagemPreenchimento());
    this.carregarDemanda(this.demanda._id);
    this.carregarServicos();
  }

  visualizarAnexo(anexo:Anexo){
    this.fileService.downloadAnexo(anexo).subscribe((response:any)=>{
      if(response?.statusCode < 400){
        const url = response.message;
        let message = `<p>Nome: ${anexo.nome}.</p> <a href="${url}" download>${anexo.nome}</a>`;
        notify(this.dialog, "Download de Arquivo", message, ()=>{});
      }
      else{
        let message = "<p>Arquivo não encontrado</p>"
      }

      console.log("url", response)
    });
  }

  exibirMensagemPreenchimento(){
    let message = "<p>Sua demanda será encaminhada para equipe de arquitetos.<p>";
    message += "<p>Em breve entraremos em contato. Muito obrigado!</p>";
    notify(this.dialog, "Dados enviados", message, ()=>{});
  }

  get readonly():boolean {
    return this.demanda?.status != StatusDemanda.EM_PREENCHIMENTO;
  }
}
