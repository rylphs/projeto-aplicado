import { map } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { Usuario } from './usuario.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends ApiService<Usuario> {

  public listarUsuarios(){
    let userList = this.doGetAll(environment.APIGATEWAY_ROUTES.USUARIO);
    return userList.pipe(map((result)=>{
      return result.message.map((obj:Usuario) => Usuario.fromDadosUsuario(obj))
    }));
  }
}
