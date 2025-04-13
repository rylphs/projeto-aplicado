import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { catchError, concatMap, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../features/usuarios/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService<any>{
  private _currentUser!: Usuario | null;
  private _token!: string;

  checkPassword(username:string, password:string) {

  }

  createSession(usuario:Usuario, token: string|null){
    window.sessionStorage.setItem(environment.APP_USER_KEY, JSON.stringify(usuario));
    this._currentUser = usuario;
    if(token){
      this._token = token;
      window.sessionStorage.setItem(environment.APP_TOKEN_KEY, token);
    }
  }

  login(username:string, password:string){
    return this.doPost("login", {
      payload: {user: username, pwd:password }
    }).pipe(map((data) => {
      if(data.statusCode >= 400){
        throw new Error(data.message)
      }
      this.createSession(data.message.usuario, data.message.token)
      return data.message
    }))
  }

  logout(){
    this._currentUser = null;
    this._token = "";
    window.sessionStorage.removeItem(environment.APP_TOKEN_KEY);
    window.sessionStorage.removeItem(environment.APP_USER_KEY);
  }

  isLogged(): boolean {
    return this.currentUser != null;
  }

  get token():string|null {
    if(this._token)
      return this._token;
    let tokenData = window.sessionStorage.getItem(environment.APP_TOKEN_KEY);
    if(tokenData){
      this._token = tokenData;
      return tokenData;
    }
    return null;
  }

  get currentUser():Usuario|null {
    if(this._currentUser)
      return this._currentUser;
    let userData = window.sessionStorage.getItem(environment.APP_USER_KEY);
    if (userData){
      let jsonUserData = JSON.parse(userData)
      let usuario:Usuario = new Usuario;
      usuario.email = jsonUserData.email;
      usuario.nome = jsonUserData.nome;
      usuario.role = jsonUserData.role;
      usuario.thumb = jsonUserData.thumb;
      this._currentUser = usuario;
      return usuario;
    }
    return null;
  }

}
