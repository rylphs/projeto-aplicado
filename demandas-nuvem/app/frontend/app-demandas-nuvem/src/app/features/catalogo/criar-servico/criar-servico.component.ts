import { MessageService } from './../../../shared/message/message.service';
import { MatDialog } from '@angular/material/dialog';
import { Servico } from './../servico.model';
import { Campo, TIPOS } from './../campo.model';
import { Component, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ServicoService } from '../servico.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { confirm } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-criar-servico',
  imports: [MatTableModule, MatIconModule, MatCardModule, MatSelectModule,
    CdkDropList, CdkDrag, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormsModule, MatChipsModule, CdkDragHandle, MatAutocompleteModule],
  templateUrl: './criar-servico.component.html',
  styleUrl: './criar-servico.component.css'
})
export class CriarServicoComponent {
  datasource!: MatTableDataSource<Campo>;
  cols: string[] = ["nome", "label"];
  campos!: Campo[];
  valuesCampo?: Campo;
  editedCampo?: Campo;
  opcoesTipoCampo = ["combobox", "texto", "numerico", "boleano", "textoarea"];
  dialog = inject(MatDialog);
  servico!: Servico;
  servicos!: Servico[];
  tiposCampo = Campo.tipos;

  constructor(private servicoService: ServicoService, private router: Router,
    route: ActivatedRoute, private messageService: MessageService, private snackbar: MatSnackBar) {

    this.servico = new Servico();
    const idServico = route.snapshot.params["id"];


    servicoService.getAllServicos().subscribe((response) => {
      if (response.statusCode < 400) {
        this.servicos = response.message;
        const servico = this.servicos.find(servico => servico._id == idServico)
        if (servico) {
          this.servico = servico;
          this.campos = servico.campos;
          this.datasource = new MatTableDataSource(this.campos);
        }
      }
    })
    /* servicoService.getServico(idServico,).subscribe((response)=>{
       if(response.statusCode < 400){
         this.campos = response.message.campos;
         this.datasource = new MatTableDataSource(this.campos);
         this.servico = response.message;
       }
     })*/
  }

  get tiposDeCampo(){
    return TIPOS;
  }

  salvarServico() {
    this.servicoService.atualizrServico(this.servico).subscribe(response => {
      if (response.statusCode < 400) {
        this.messageService.getSubject("servico").next({
          message: "Serviço adicionado com sucesso"
        })
        this.router.navigate(["app", "catalogo"]);
      }
      else {
        this.snackbar.open(`Erro ao atualizar catálogo: ${response.message}`, 'fechar')
      }
    })
  }

  voltar() {
    this.router.navigate(["app", "catalogo"]);
  }

  drop(event: CdkDragDrop<Campo[]>) {
    moveItemInArray(this.campos, event.previousIndex, event.currentIndex);
    this.campos[event.previousIndex].ordem = event.currentIndex;
    this.campos[event.currentIndex].ordem = event.previousIndex;
  }

  addDominio(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (this.editedCampo?.definicao?.dominio && this.editedCampo.definicao.dominio instanceof Array) {
      const i = this.editedCampo.definicao.dominio.indexOf(value);
      if (i < 0) {
        this.editedCampo.definicao.dominio.push(value);
      }
    }

    event.chipInput!.clear();
  }

  removeDominio(value: string) {
    if (this.editedCampo?.definicao?.dominio && this.editedCampo.definicao.dominio instanceof Array) {
      const i = this.editedCampo.definicao.dominio.indexOf(value);
      this.editedCampo.definicao.dominio.splice(i, 1);
      return this.editedCampo.definicao.dominio;
    }
    return [];
  }

  isEditing(campo: Campo) {
    return this.editedCampo && campo?.nome == this.editedCampo.nome;
  }

  adicionarCampo(posicao: number) {
    console.log("pos", posicao)
    const campo = new Campo();
    campo.nome = "campo_" + posicao;
    this.campos.splice(posicao, 0, campo);
  }

  editarCampo(campo: Campo) {
    this.editedCampo = campo;
    // this.valuesCampo = Campo.fromData(campo);
  }

  removerCampo(campo: Campo) {
    const title = "Remover Campo";
    const text = "Tem certeza?";
    confirm(this.dialog, title, text, (confirma) => {
      if (confirma) {
        this.campos = this.campos.filter((campoLista) => campoLista.nome != campo.nome);
      }
    })
  }

  cancelarEdicaoCampo() {
    if (this.editedCampo && this.valuesCampo) {
      this.editedCampo.ajuda = this.valuesCampo.ajuda;
      this.editedCampo.default = this.valuesCampo.default;
      this.editedCampo.label = this.valuesCampo.label;
      this.editedCampo.nome = this.valuesCampo.nome;
      this.editedCampo.obrigatorio = this.valuesCampo.obrigatorio;
      this.editedCampo.definicao = this.valuesCampo.definicao;
      this.editedCampo.ordem = this.valuesCampo.ordem;
    }

    this.editedCampo = undefined;
  }

  aceitarAlteracaoCampo() {
    this.editedCampo = undefined;
    this.valuesCampo = undefined;
  }
}
