import { MatDialog } from '@angular/material/dialog';
import { MessageService } from './../../../shared/message/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Catalogo, CatalogoService } from './../catalogo.service';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Servico, ServicoService } from '../servico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { confirm } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lista-catalogo',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './lista-catalogo.component.html',
  styleUrl: './lista-catalogo.component.css'
})
export class ListaCatalogoComponent {
  catalogos!: Catalogo[];
  catalogoAtual!: Catalogo;
  datasource!: MatTableDataSource<Catalogo>
  servicosDatasource!: MatTableDataSource<Servico>
  cols =  ["versao", "actions"];
  colsServico = ["nome", "label", "descricao", "actions"]

  constructor(private catalogoService: CatalogoService, private servicoService: ServicoService,
    private router:Router, private route:ActivatedRoute, private snackbar: MatSnackBar,
    private dialog: MatDialog, private messageService: MessageService){

    this.messageService.getSubject("servico").subscribe(response=>{
      this.snackbar.open(response.message, "fechar");
    })
    this.catalogoService.getAllCatalogos().subscribe((response)=>{

      if(response.statusCode < 400){
        this.catalogos = response.message;
        this.datasource = new MatTableDataSource(this.catalogos);
      }
    })
    this.catalogoService.getCurrentCatalogo().subscribe((response)=>{
      if(response.statusCode < 400){
        console.log(response.message);
        this.catalogoAtual = response.message;
        this.servicosDatasource = new MatTableDataSource(this.catalogoAtual.servicos);
      }
    })
  }

  adicionarServico(){
    let servico = new Servico();
    servico.catalogo = this.catalogoAtual?.versao;
    this.servicoService.selectedServico.set(servico);
    this.router.navigate(["servico"], {relativeTo: this.route});
  }

  novaVersao(){
    const message = "A geração de uma nova versão não irá impactar os formulários já existentes. " +
      "Somente os novos formulários serão criados sob a nova versão. Deseja prosseguir?"
    confirm(this.dialog, "Gerar Versão", message, (confirma)=>{
      if(confirma){
        this.catalogoService.gerarVersao().subscribe((response)=>{
          if(response.statusCode < 400){
            this.catalogoAtual = response.message;
            let message = `Nova versão ${this.catalogoAtual.versao} gerada com sucesso.`;
            this.servicosDatasource.data = this.catalogoAtual.servicos;
            this.snackbar.open(message, "fechar");

          } else{
            let message = `Erro: ${response.message}`;
            this.snackbar.open(message, "fechar");
          }
        })
      }
    })

  }

  edit(catalogo:Catalogo){

  }

  editServico(servico:Servico){
    this.servicoService.selectedServico.set(servico);
    this.router.navigate(["servico", servico._id], {relativeTo: this.route});
  }

  delete(servico:Servico){
    const title = `Excluir Serviço ${servico.label}`;
    const message = "Tem certeza?";
    confirm(this.dialog, title, message, (confirma)=>{
      if(confirma){
        console.log("antes", servico.nome, this.catalogoAtual.servicos)
        this.catalogoAtual.servicos = this.catalogoAtual.servicos.filter((s)=>{return s.nome != servico.nome});
        console.log("depois", this.catalogoAtual.servicos)
        if(servico._id)
          this.servicoService.excluirServico(servico._id).subscribe((response)=>{
            if(response.statusCode < 400){
              this.snackbar.open("Serviço excluído com sucesso", "fechar");
              this.servicosDatasource.data = this.catalogoAtual.servicos;
            } else this.snackbar.open(message, "fechar");
          });

      }
    })
  }
}
