import { MessageService } from './../../../shared/message/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Catalogo, CatalogoService } from './../catalogo.service';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Servico, ServicoService } from '../servico.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lista-catalogo',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './lista-catalogo.component.html',
  styleUrl: './lista-catalogo.component.css'
})
export class ListaCatalogoComponent {
  catalogos!: Catalogo[];
  catalogoAtual!: Catalogo|null;
  datasource!: MatTableDataSource<Catalogo>
  servicosDatasource!: MatTableDataSource<Servico>
  cols =  ["versao", "actions"];
  colsServico = ["nome", "label", "descricao", "actions"]

  constructor(private catalogoService: CatalogoService, private servicoService: ServicoService,
    private router:Router, private route:ActivatedRoute, private snackbar: MatSnackBar,
    private messageService: MessageService){

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
      console.log(response)
      if(response.statusCode < 400){
        console.log(response.message);
        this.catalogoAtual = response.message;
        this.servicosDatasource = new MatTableDataSource(this.catalogoAtual.servicos);
      }
    })
  }

  edit(catalogo:Catalogo){

  }

  editServico(servico:Servico){
    this.servicoService.selectedServico.set(servico);
    this.router.navigate(["servico", servico._id], {relativeTo: this.route});
  }

  delete(catalogo:Catalogo){}
}
