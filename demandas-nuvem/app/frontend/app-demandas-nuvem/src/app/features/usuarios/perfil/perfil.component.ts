import { UsuarioService } from './../usuario.service';
import { AuthService } from './../../../core/auth/auth.service';
import { FileService } from './../../../shared/file/file.service';
import { Component, signal,  WritableSignal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Usuario } from '../usuario.model';
import { AvatarComponent } from "../avatar/avatar.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import {md5} from "js-md5";

@Component({
  selector: 'app-perfil',
  imports: [FormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatButtonModule, RouterLink, AvatarComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario!:Usuario;
  senha!:string;
  senhaNova!:string;
  repeticaoSenha!:string;
  file: WritableSignal<File|null> = signal(null)

  constructor(private fileService: FileService, private usuarioService:UsuarioService,
    private authService: AuthService, private snackbar: MatSnackBar){
    this.usuario = new Usuario();

    if(authService.currentUser){
      this.usuario.nome = authService.currentUser.nome;
      this.usuario.email = authService.currentUser.email;
      this.usuario.thumb = authService.currentUser.thumb;
      this.usuario.role = authService.currentUser.role;
      this.usuario.inativo = authService.currentUser.inativo;
    }

  }

  showMessage(message:string){
    this.snackbar.open(message, "close");
  }

  atualizarDados() {
    let file = this.file();
    if(file != null){
      let blob = file.slice(0, file.size, file.type);
      let extension = file.name.replaceAll(/([^.]+\.)*/g, '');
      let fileName = "thumb_" + md5(this.usuario.email) + "." + extension;
      this.usuario.thumb = fileName;

      let fileToUpload = new File([blob], fileName, {type: file.type});
      this.fileService.updateFile("user_thumbs", fileToUpload);
    }
    let senha = null;

    if(!!this.senhaNova && this.senhaNova == this.repeticaoSenha){
      senha = this.senhaNova
    }
    this.usuarioService.atualizarUsuario(this.usuario, senha).subscribe((usuario)=>{
      this.showMessage("Dados atualizados com sucesso");
      this.authService.createSession(usuario, null);
    })
  }
}
