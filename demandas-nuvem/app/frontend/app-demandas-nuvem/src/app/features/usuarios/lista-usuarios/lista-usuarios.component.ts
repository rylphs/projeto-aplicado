import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { confirm } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MessageService, MessageType } from '../../../shared/message/message.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent {
  usuarios!: Usuario[];
  datasource: any = "";
  displayedColumns: string[] = ["inativo", 'nome', 'email', 'role', 'actions'];
  readonly dialog = inject(MatDialog);
  _mensagens: Subject<MessageType>;

  constructor(private usuarioService:UsuarioService, private snackbar: MatSnackBar,
    messageService: MessageService, private router:Router, private route:ActivatedRoute){
    usuarioService.listarUsuarios().subscribe((usuarios)=>{
      this.usuarios = usuarios;
      this.datasource = new MatTableDataSource(this.usuarios);
    });
    this._mensagens = messageService.getSubject("usuarios");

    messageService.getSubject("usuarios").subscribe({
      next:this.showMessage.bind(this), error: this.showError.bind(this)})
  }

  loadUsuarios(){
    this.usuarioService.listarUsuarios().subscribe((usuarios)=>{
      this.usuarios = usuarios;
      this.datasource.data = this.usuarios;
    });
  }

  showError(message:MessageType){
    this.snackbar.open(message.message, "close");
  }

  showMessage(message:MessageType){
    this.snackbar.open(message.message, "close");
  }

  get mensagem():MessageType{
    return {message:""}
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  edit(usuario: Usuario){
    this.usuarioService.selectedUser.set(usuario);
    this.router.navigate(["editar", usuario._id], { relativeTo: this.route });
  }

  delete(usuario:Usuario){
    let title = "Excluir Usuário";
    let content = `Deseja realmente excluir o usuario ${usuario.nome}?`;
    confirm(this.dialog, title, content, result =>{
      if(result){
        this.usuarioService.excluirUsuario(usuario.email).subscribe({
          next: ()=>{
            this.showMessage({message: `Usuário ${usuario.nome} excluído com sucesso`})

            this.loadUsuarios();
          },
          error: ()=>this.showMessage({message: `Erro ao excluir o usuário ${usuario.nome}`})
        })
      }
      else console.log("nao vou excluir")
    })

  }

}
