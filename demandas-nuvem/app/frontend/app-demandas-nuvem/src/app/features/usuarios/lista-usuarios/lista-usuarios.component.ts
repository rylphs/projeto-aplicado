import { Component, inject } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { confirm, ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lista-usuarios',
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent {
  usuarios!: Usuario[];
  datasource: any = "";
  displayedColumns: string[] = ['nome', 'email', 'role', 'actions'];
  readonly dialog = inject(MatDialog);

  constructor(private usuarioService:UsuarioService){
    usuarioService.listarUsuarios().subscribe((usuarios)=>{
      this.usuarios = usuarios;
      this.datasource = new MatTableDataSource(this.usuarios);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  edit(usuario: Usuario){
    console.log("editing ", usuario)
  }

  delete(usuario:Usuario){
    let title = "Excluir Usuário";
    let content = `Deseja realmente excluir o usuario ${usuario.nome}?`;
    confirm(this.dialog, title, content, result =>{
      if(result){
        console.log("excluindo usuario")
      }
      else console.log("nao vou excluir")
    })

  }

}
