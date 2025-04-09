import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LoggedAreaComponent } from './core/main/logged-area/logged-area.component';
import { ListaUsuariosComponent } from './features/usuarios/lista-usuarios/lista-usuarios.component';

export const Paths = {
  LOGIN: "login",
  MAIN: "app"
}

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'app', component: LoggedAreaComponent, children: [
    {path:"", redirectTo:"usuarios", pathMatch:'full'},
    {path: 'usuarios', component: ListaUsuariosComponent, data:{"titulo": "Usuários", breadcrumb: ["Usuários","Adicionar"]}}
  ]},
];
