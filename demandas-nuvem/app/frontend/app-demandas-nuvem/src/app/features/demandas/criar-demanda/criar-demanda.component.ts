import { Component, Signal, WritableSignal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';


import { Paths } from '../../../app.routes';
import { MessageService, MessageType } from '../../../shared/message/message.service';
import { DemandaService } from '../demanda.service';
import { Demanda } from '../demanda-model';
import { SelecionarUsuarioComponent } from '../../usuarios/selecionar-usuario/selecionar-usuario.component';
import { Usuario } from '../../usuarios/usuario.model';

@Component({
  selector: 'app-criar-demanda',
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './criar-demanda.component.html',
  styleUrl: './criar-demanda.component.css'
})
export class CriarDemandaComponent {
  isEditing:boolean = false;
  demanda:Demanda = new Demanda();
  mensagens: Subject<MessageType>;

  constructor(private demandaService:DemandaService,
    private router:Router, private route:ActivatedRoute,
    private messageService:MessageService, private dialog: MatDialog){
      this.demanda = this.demandaService.selectedDemanda();
      if(this.demanda._id){
        this.isEditing = true;
      }

      this.mensagens = messageService.getSubject("demandas");
    }

    cadastrarDemanda(){
      this.demandaService.criarDemanda(this.demanda).subscribe({
        next: (res) => {
          this.mensagens.next({message: "Demanda cadastrada com sucesso"});
          this.router.navigate([Paths.MAIN, Paths.LISTA_DEMANDAS]);
        },
        error: (error) => {
          this.mensagens.error({message: error});
          this.router.navigate([Paths.MAIN, Paths.LISTA_DEMANDAS]);
        }});
    }

  atualizarDemanda(){
    this.demandaService.atualizarDemanda(this.demanda).subscribe({
      next: (res) => {
        this.mensagens.next({message: "Demanda atualizada com sucesso"});
        this.router.navigate([Paths.MAIN, Paths.LISTA_DEMANDAS]);
      },
      error: (error) => {
        this.mensagens.error({message: error});
        this.router.navigate([Paths.MAIN, Paths.LISTA_DEMANDAS]);
      }});
  }

  selecionarTecnico(){
    const dialogRef = this.dialog.open(SelecionarUsuarioComponent, {
      data: {role: "TECNICO"},
        height: '250px',
        width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.demanda.tecnico = result;
      }
    });
  }

  selecionarGestor(): void {
    const dialogRef = this.dialog.open(SelecionarUsuarioComponent, {
      data: {role: "GESTOR"},
        height: '250px',
        width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.demanda.gestor = result;
      }
    });
  }
}
