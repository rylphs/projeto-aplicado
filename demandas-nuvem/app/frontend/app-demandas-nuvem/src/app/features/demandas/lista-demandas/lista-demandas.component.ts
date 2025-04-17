import { Component, inject } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { confirm, notify } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MessageService, MessageType } from '../../../shared/message/message.service';
import { DemandaService } from '../demanda.service';
import { Demanda } from '../demanda-model';


@Component({
  selector: 'app-lista-demandas',
  imports: [MatFormFieldModule, MatTableModule, MatIconModule,
    MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './lista-demandas.component.html',
  styleUrl: './lista-demandas.component.css'
})
export class ListaDemandasComponent {
  demandas!: Demanda[];
  datasource!: any;
  displayedColumns: string[] = ['cliente', 'descricao', 'tecnico', 'gestor', 'status', 'actions'];
  readonly dialog = inject(MatDialog);

  constructor(private demandaService: DemandaService, private snackbar: MatSnackBar,
    private router: Router, private route: ActivatedRoute, private messageService: MessageService) {
    this.loadDemandas();
    messageService.getSubject("demandas").subscribe({
      next: this.showMessage.bind(this), error: this.showError.bind(this)
    })
  }

  loadDemandas() {
    this.demandaService.listarDemandas().subscribe((result) => {
      if(result.statusCode < 400){
        this.demandas = result.message;
      }
      if(!this.datasource){
        this.datasource = new MatTableDataSource(this.demandas);
      }
      else this.datasource.data = this.demandas;
    });
  }

  gerarFormulario(demanda: Demanda){
    const url = `http://localhost:4200/formulario/${demanda._id}`;
    const dialogContent = `<p>Url gerada para a demanda:</p> <a href="${url}">${url}</a>.
    <p>Informar a URL ao cliente para preenchimento.</p>`
    this.demandaService.gerarFormulario(demanda).subscribe((response)=>{
      console.log("formulario", response)
      if(response.statusCode < 400){
        notify(this.dialog, "Formulário gerado", dialogContent, (data)=>{
          this.loadDemandas();
        });
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  edit(demanda: Demanda) {
    this.demandaService.selectedDemanda.set(demanda);
    this.router.navigate(["editar", demanda._id], { relativeTo: this.route });
  }

  novaDemanda(){
    this.demandaService.selectedDemanda.set(new Demanda());
  }

  delete(demanda: Demanda) {
    let title = "Excluir Demanda";
    let content = `Deseja realmente excluir o demanda ${demanda.descricao}?`;
    confirm(this.dialog, title, content, result => {
      if (result) {
        this.demandaService.excluirDemanda(demanda).subscribe({
          next: () => {
            this.showMessage({ message: `Demanda ${demanda.descricao} excluído com sucesso` })

            this.loadDemandas();
          },
          error: (m) => this.showMessage({ message: `Erro ao excluir a demanda ${m}` })
        })
      }
    })

  }

  showError(message: MessageType) {
    this.snackbar.open(message.message, "close");
  }

  showMessage(message: MessageType) {
    this.snackbar.open(message.message, "close");
  }
}
