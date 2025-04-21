import { InstanciaCampo } from './../campo.model';
import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InstanciaServico } from '../servico.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServicoService } from '../servico.service';
import { DialogCampoInputComponent } from '../dialog-campo-input/dialog-campo-input.component';

@Component({
  selector: 'app-campo-servico',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './campo-servico.component.html',
  styleUrl: './campo-servico.component.css'
})
export class CampoServicoComponent {
  @Input() campo!: InstanciaCampo;
  instancia:InstanciaServico[] = [];
  datasource!: MatTableDataSource<InstanciaServico>;
  columns = ["label", "resumo", "actions"]
  dialogRef?: MatDialogRef<DialogCampoInputComponent>;
  instanciaAlterada?: InstanciaServico;
  editedIndex?:number;

  constructor(private dialog: MatDialog, private servicoServic: ServicoService){
    this.datasource = new MatTableDataSource(this.instancia);
  }

  getNomeServico(){
    return this.campo.metaDados.label;
  }

  abrirDialogo(instanciaServico: InstanciaServico){
    this.dialog.open(DialogCampoInputComponent,{
      height: "calc(100% - 30px)",
      minWidth: "calc(100% - 50px)",
      data: {
        campos: instanciaServico.campos,
        readonly: false
      }
    }).afterClosed().subscribe(result =>{
      if(result) this.confirmarAdicao(result);
    })
  }

  adicionar(){
    const idServico = this.campo.metaDados.definicao.dominio;
    if(idServico){
      this.servicoServic.getServico(idServico as string).subscribe(response=>{
        if(response.statusCode < 400){
          this.instanciaAlterada = response.message.criarInstancia();
          this.abrirDialogo(this.instanciaAlterada);
        }
      })
    }
  }

  confirmarAdicao(campos:InstanciaCampo[]){
    if(this.instanciaAlterada){
      const index = this.instancia.indexOf(this.instanciaAlterada);
      this.instanciaAlterada.campos = campos;
      console.log(index, campos)
      if(index < 0){
        this.instancia.push(this.instanciaAlterada);
      }
      this.instanciaAlterada = undefined;
      console.log(this.instancia)
      this.datasource.data = this.instancia;
    }
  }

  edit(servico:InstanciaServico){
    this.instanciaAlterada = servico;
    this.abrirDialogo(servico.copy());
  }

  delete(servico:InstanciaServico){
    const index = this.instancia.indexOf(servico);
    this.instancia.splice(index, 1);
  }


}
