import { MessageService } from './../../../shared/message/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicoService } from './../../catalogo/servico.service';
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
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { InstanciaServico, Servico } from '../../catalogo/servico.model';


type Pendencia = {
  nome:string;
  pendencias: string[];
}

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
  colunasResumoAnexos = ["nome", "tipo"]
  servicos: Servico[] = [];
  colunasServicos = ["label", "quantidade", "resumo", "actions"];
  colunasResumoServicos = ["label", "quantidade", "resumo"];
  stepperIndex = 0;
  pendencias!:Pendencia[];
  readonly dialog = inject(MatDialog);

  constructor(route: ActivatedRoute, private demandaService: DemandaService,
    private servicoService: ServicoService, private router:Router,
    private fileService:FileService, private snack: MatSnackBar,
    private messageService: MessageService){

    let id = route.snapshot.params["id"];
    let step = route.snapshot.params["step"];
    if(step) this.stepperIndex = Number.parseInt(step);
    this.carregarDemanda(id);
    this.carregarServicos();
    this.configuarMensagemDemanda();
  }

  configuarMensagemDemanda(){
    this.messageService.getSubject("demanda").subscribe(message => {
      this.snack.open(message.message, "fechar");
    })
  }

  carregarDemanda(id:string){
    if(id){
      this.demandaService.getDemanda(id).subscribe((response)=>{
        if (response.statusCode < 400){
          this.demanda = response.message;
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
    instancia.id = this.demanda.servicos.length;
    this.demanda.servicos.push(instancia);
    this.demandaService.atualizarDemanda(this.demanda).subscribe(response => {
      if(response.statusCode < 400){
        this.dataSourceServicos.data = this.demanda.servicos;
        const state = {state: {servico:instancia, novo:true}};
        this.router.navigate(["formulario",this.demanda._id,"servico", servico._id, instancia.id]);
      }
      else {
        this.snack.open(`Erro ao salvar demanda: ${response.message}`);
      }
    })

  }

  editarServico(instancia:InstanciaServico){
    const state = {state: {servico:instancia, novo:false}};
    this.router.navigate(["formulario",this.demanda._id, "servico", instancia.metaData.nome, instancia.id]);
  }

  removerServico(instancia:InstanciaServico){
    let indice = this.demanda.servicos.indexOf(instancia);
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

  stepChange(event: StepperSelectionEvent){
    if(event.selectedIndex == 3){
      this.listPendencias();
    }
  }

  posuiPendencias(){
    return this.pendencias && this.pendencias.length >0;
  }

  listPendencias(){
    this.pendencias = this.demanda.servicos.map((servico)=> {
      const result: Pendencia = {
        nome: servico.metaData.label,
        pendencias: []
      }
      result.pendencias = servico.campos.filter(
        (campo)=> campo.metaDados.obrigatorio && !campo.value
      ).map((campo)=> campo.nome);
      return result;
    })

    this.pendencias = this.pendencias.filter((servico)=>servico.pendencias && servico.pendencias.length > 0)
  }
}
