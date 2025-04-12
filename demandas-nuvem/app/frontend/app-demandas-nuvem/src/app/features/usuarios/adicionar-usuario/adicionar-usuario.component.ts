import { Usuario } from './../usuario.model';
import { Component, Signal, WritableSignal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Paths } from '../../../app.routes';
import { UsuarioService } from '../usuario.service';
import { MessageService, MessageType } from '../../../shared/message/message.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-adicionar-usuario',
  imports: [MatSelectModule, MatInputModule, MatFormFieldModule,
    MatButtonModule, RouterLink, FormsModule],
  templateUrl: './adicionar-usuario.component.html',
  styleUrl: './adicionar-usuario.component.css'
})
export class AdicionarUsuarioComponent {
  usuario!: Usuario;
  senha!: string;
  repeticaoSenha!: string;
  mensagens: Subject<MessageType>;
  isEditing: boolean = false;

  papeis:any = {
    GESTOR: "Gestor",
    ADMIN: "Administrador",
    TECNICO: "Técnico"
  }

  lista_papeis = Object.keys(this.papeis)

  constructor(private router:Router, private activatedRoute:ActivatedRoute,
    private usuarioService: UsuarioService, messageService: MessageService){
      this.usuario = this.usuarioService.selectedUser();
      if(this.usuario._id){
        this.isEditing = true;
      }
      this.mensagens = messageService.getSubject("usuarios");
  }

  cadastrarUsuario(){
    this.usuarioService.cadastrarUsuario(this.usuario, this.senha).subscribe({
      next: (res) => {
        console.log(res)
        this.mensagens.next({message: "Usuario Inserido com sucesso"});
        this.router.navigate([Paths.MAIN, Paths.LISTA_USUARIOS]);
      },
      error: (error) => {
        this.mensagens.error({message: error});
        this.router.navigate([Paths.MAIN, Paths.LISTA_USUARIOS]);
      }});
  }

  atualizarUsuario(){
    this.usuarioService.atualizarUsuario(this.usuario).subscribe({
      next: (res) => {
        console.log(res)
        this.mensagens.next({message: "Usuario Atualizado com sucesso"});
        this.router.navigate([Paths.MAIN, Paths.LISTA_USUARIOS]);
      },
      error: (error) => {
        this.mensagens.error({message: error});
        this.router.navigate([Paths.MAIN, Paths.LISTA_USUARIOS]);
      }});
  }

  cancelar(){
    this.router.navigate([Paths.LISTA_USUARIOS]);
  }

}
