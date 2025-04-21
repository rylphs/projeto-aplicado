import { map } from 'rxjs';
import { InstanciaCampo } from './../campo.model';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InstanciaServico, Servico } from '../servico.model';
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
export class CampoServicoComponent implements AfterViewInit{
  @Input() campo!: InstanciaCampo;
  servico!: Servico;
  instancias:InstanciaServico[] = [];
  datasource!: MatTableDataSource<InstanciaServico>;
  columns = ["label", "resumo", "actions"]
  dialogRef?: MatDialogRef<DialogCampoInputComponent>;
  instanciaAlterada?: InstanciaServico;
  editedIndex?:number;

  constructor(private dialog: MatDialog, private servicoServic: ServicoService){
    this.datasource = new MatTableDataSource(this.instancias);
  }

  ngAfterViewInit(): void {
    const idServico = this.campo.metaDados.definicao.dominio;
    if(idServico){
      this.servicoServic.getServico(idServico as string).subscribe(response=>{
        if(response.statusCode < 400){
          this.servico = response.message;
          this.campo.value = this.campo.value.map(Servico.instanciaFromData)
          this.instancias = this.campo.value;
          this.datasource.data = this.instancias;
        }
      })
    }
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
    if(this.servico){
      this.instanciaAlterada = this.servico.criarInstancia();
      this.abrirDialogo(this.instanciaAlterada);
    }
  }

  confirmarAdicao(campos:InstanciaCampo[]){
    if(this.instanciaAlterada){
      const index = this.instancias.indexOf(this.instanciaAlterada);
      this.instanciaAlterada.campos = campos;
      console.log(index, campos)
      if(index < 0){
        this.instancias.push(this.instanciaAlterada);
      }
      this.campo.value = this.campo.value || [];

      this.campo.value.push(this.instanciaAlterada);
      this.instanciaAlterada = undefined;
      console.log(this.instancias)
      console.log(this.campo);
      this.datasource.data = this.instancias;
    }
  }

  edit(servico:InstanciaServico){
    this.instanciaAlterada = servico;
    this.abrirDialogo(servico.copy());
  }

  delete(servico:InstanciaServico){
    const index = this.instancias.indexOf(servico);
    this.instancias.splice(index, 1);
    this.datasource.data = this.instancias;
  }


}
