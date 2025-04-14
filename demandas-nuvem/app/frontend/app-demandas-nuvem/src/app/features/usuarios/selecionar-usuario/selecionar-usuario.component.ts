import { Component, Input, WritableSignal, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';




import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UsuarioService } from './../usuario.service';
import { Usuario } from '../usuario.model';


export interface DialogData {
  role: string;
}

@Component({
  selector: 'app-selecionar-usuario',
  imports: [MatAutocompleteModule, FormsModule, MatDialogActions, MatDialogTitle, MatDialogContent,
    MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './selecionar-usuario.component.html',
  styleUrl: './selecionar-usuario.component.css'
})
export class SelecionarUsuarioComponent {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<SelecionarUsuarioComponent>);
  usuarios!: Usuario[];
  usuarioSelecionado!:Usuario;

  constructor(private usuarioService: UsuarioService){
    let role = this.data.role;
    usuarioService.listarUsuarios().subscribe((response) =>{
      if(response.statusCode < 400){
        this.usuarios = response.message;
      } else {
        this.usuarios = [];
      }
      if(role){
        this.usuarios = this.usuarios.filter(usuario => usuario.role == role)
      }
    });
  }

  cancelar(){
    this.dialogRef.close(false);
  }

  confirmar(){
    this.dialogRef.close(this.usuarioSelecionado);
  }
}
