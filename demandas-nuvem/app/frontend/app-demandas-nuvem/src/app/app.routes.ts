import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LoggedAreaComponent } from './core/main/logged-area/logged-area.component';
import { ListaUsuariosComponent } from './features/usuarios/lista-usuarios/lista-usuarios.component';
import { AdicionarUsuarioComponent } from './features/usuarios/adicionar-usuario/adicionar-usuario.component';

export const Paths = {
  LOGIN: "login",
  MAIN: "app",
  LISTA_USUARIOS: "usuarios"
}

export const routes: Routes = [
  {path:"", redirectTo:"app", pathMatch:"full"},
  {path: 'login', component: LoginComponent},
  {path: 'app', component: LoggedAreaComponent, children: [
    {path:"", redirectTo:"usuarios", pathMatch:'full'},
    {path: 'usuarios', component: ListaUsuariosComponent,
      data:{"titulo": "Usuários", breadcrumb: ["Usuários"]}},
    {path: 'usuarios/novo', component: AdicionarUsuarioComponent,
        data:{"titulo": "Adicionar Usuário", breadcrumb: ["Usuários", "Adicionar"]}},
    {path: 'usuarios/editar/:id', component: AdicionarUsuarioComponent,
        data:{"titulo": "Editar Usuário", breadcrumb: ["Usuários", "Editar"]}},
  ]},
];
