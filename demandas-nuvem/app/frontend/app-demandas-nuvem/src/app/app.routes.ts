import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { LoggedAreaComponent } from './core/main/logged-area/logged-area.component';
import { ListaUsuariosComponent } from './features/usuarios/lista-usuarios/lista-usuarios.component';
import { AdicionarUsuarioComponent } from './features/usuarios/adicionar-usuario/adicionar-usuario.component';
import { ListaDemandasComponent } from './features/demandas/lista-demandas/lista-demandas.component';
import { CriarDemandaComponent } from './features/demandas/criar-demanda/criar-demanda.component';
import { PerfilComponent } from './features/usuarios/perfil/perfil.component';
import { PreencherDemandaComponent } from './features/demandas/preencher-demanda/preencher-demanda.component';
import { AdicionarServicoComponent } from './features/demandas/adicionar-servico/adicionar-servico.component';
import { ListaCatalogoComponent } from './features/catalogo/lista-catalogo/lista-catalogo.component';
import { CriarServicoComponent } from './features/catalogo/criar-servico/criar-servico.component';
import { isLoggedInGuard } from './core/auth/route-guard';

export const Paths = {
  LOGIN: "login",
  MAIN: "app",
  LISTA_USUARIOS: "usuarios",
  LISTA_DEMANDAS: "demandas"}

export const routes: Routes = [
  {path:"formulario/:id", component: PreencherDemandaComponent, pathMatch:'full'},
  {path:"formulario/:id/servico/:idServico", component: AdicionarServicoComponent},
  {path:"formulario/:id/servico/:idServico/:indice", component: AdicionarServicoComponent},
  {path:"formulario/:id/:step", component: PreencherDemandaComponent},


  {path:"", redirectTo:"app", pathMatch:"full"},
  {path: 'login', component: LoginComponent},

  {path: 'app', component: LoggedAreaComponent, canActivate: [isLoggedInGuard], children: [
    {path:"", redirectTo:"demandas", pathMatch:'full'},
    {path: 'catalogo', component: ListaCatalogoComponent,
      data:{"titulo": "Catálogos", breadcrumb: ["Catálogo"]}
    },
    {path: 'catalogo/servico/:id', component: CriarServicoComponent,
      data:{"titulo": "Catálogo", breadcrumb: ["Catálogo", "Editar Serviço"]}
    },
    {path: 'catalogo/servico', component: CriarServicoComponent,
      data:{"titulo": "Catálogo", breadcrumb: ["Catálogo", "Novo Serviço"]}
    },
    {path: 'perfil', component: PerfilComponent},
    {path: 'usuarios', component: ListaUsuariosComponent,
      data:{"titulo": "Usuários", breadcrumb: ["Usuários"]}},
    {path: 'usuarios/novo', component: AdicionarUsuarioComponent,
        data:{"titulo": "Adicionar Usuário", breadcrumb: ["Usuários", "Adicionar"]}},
    {path: 'usuarios/editar/:id', component: AdicionarUsuarioComponent,
        data:{"titulo": "Editar Usuário", breadcrumb: ["Usuários", "Editar"]}},
    {path: 'demandas', component: ListaDemandasComponent,
          data:{"titulo": "Demandas", breadcrumb: ["Demandas"]}},
    {path: 'demandas/nova', component: CriarDemandaComponent,
      data:{"titulo": "Adicionar Usuário", breadcrumb: ["Demandas", "Adicionar"]}},
    {path: 'demandas/editar/:id', component: CriarDemandaComponent,
        data:{"titulo": "Editar Usuário", breadcrumb: ["Demandas", "Editar"]}},
  ]},
];
