import { map } from 'rxjs';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { Usuario } from './usuario.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends ApiService<Usuario> {
  _selectedUser: WritableSignal<Usuario> = signal(new Usuario())

  public get selectedUser():WritableSignal<Usuario> {
    return this._selectedUser;
  }

  public listarUsuarios(){
    let userList = this.doGetAll(environment.APIGATEWAY_ROUTES.USUARIO);
    return userList.pipe(map((result)=>{
      console.log(result)
      if(result.statusCode < 400){
        result.message = result.message.map((obj:Usuario) => Usuario.fromDadosUsuario(obj))
      }
      return result;
    }));
  }

  public cadastrarUsuario(usuario: Usuario, senha: string){
    let user_data = {
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      senha: senha
    }
    return this.doPost(environment.APIGATEWAY_ROUTES.USUARIO, user_data).pipe(map((result)=>{
      if(result.statusCode >= 400)
        throw new Error(result.message.toString())
      return result.message;
    }));
  }

  public atualizarUsuario(usuario: Usuario, senha: string|null){
    let user_data:any = {
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    }

    if(!!senha)
      user_data.senha = senha;

    if(usuario.thumb) user_data.thumb = usuario.thumb

    return this.doPut(environment.APIGATEWAY_ROUTES.USUARIO, user_data).pipe(map((result)=>{
      if(result.statusCode >= 400)
        throw new Error(result.message.toString())
      return result.message;
    }));
  }

  public excluirUsuario(email: string){
    return this.doDelete(`${environment.APIGATEWAY_ROUTES.USUARIO}?email=${email}`);
  }
}
