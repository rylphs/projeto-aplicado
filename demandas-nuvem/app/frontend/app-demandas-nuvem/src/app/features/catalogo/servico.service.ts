import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

export enum Ambiente {
  DESENVOLVIMENTO = "Desenvolvimento",
  HOMOLOGACAO = "Homologação",
  TESTES = "Testes",
  VALIDACAO = "Validação",
  PRODUCAO = "Produção"
}

export type OpcoesTipoCampo = "combobox" | "texto" | "numerico" | "boleano" | "textoarea";

export type TipoCampo = {
  "tipo": OpcoesTipoCampo,
  dominio: string[]|null
}

export class Servico {
  _id!: string;
  nome!: string;
  label!: string;
  descricao!: string;
  campos: Campo[] = [];
  resumo!: string[];
  catalogo!: number;

  static fromObj(obj: any): Servico {
    const servico:any = new Servico();
    for(let prop in servico){
      if (prop == "campos" && obj.campos) {
        servico.campos = obj.campos.map((campo:Campo) => Campo.fromObj(campo));
      }
      else servico[prop] = obj[prop];
    }
    servico.camposResumo = obj["resumo"] || [];

    return servico;
  }

  criarInstancia(): InstanciaServico {
    const instancia = new InstanciaServico();
    instancia.idServico = this._id;
    instancia.label = this.label;
    instancia.camposResumo = this.resumo;
    for(let i in this.campos){
      let instanciaCampo = this.campos[i].criarInstancia();
      instancia.campos.push(instanciaCampo);
    }
    return instancia;
  }

}

export type Render = {
  element: string;
  tipo: string;
}

const elementMap = {
  "texto": "input",
  "numerico": "input",
  "combobox": "combobox",
  "boleano": "checkbox",
  "textoarea": "textarea"
}

const typeMap = {
  "texto": "text",
  "numerico": "number",
  "combobox": "",
  "boleano": "",
  "textoarea": ""
}

const widthMap = {
  "texto": 800,
  "numerico": 300,
  "combobox": 300,
  "boleano": 300,
  "textoarea": 800
}

export class Campo {
  nome!: string;
  label!: string;
  tipoCampo: TipoCampo = {tipo: "texto", dominio:[]};
  obrigatorio!: boolean;
  default!: string;
  ajuda!: string;
  ordem:number = 0;


  criarInstancia():InstanciaCampo {
    const instancia = new InstanciaCampo();
    instancia.nome = this.nome;
    instancia.value = this.default;
    instancia.label = this.label;
    instancia.obrigatorio = this.obrigatorio;
    instancia.ajuda = this.ajuda;
    instancia.dominio = this.tipoCampo.dominio || [];
    let tipo = this.tipoCampo.tipo;
    console.log(tipo, elementMap[tipo])
    instancia.width = widthMap[tipo];
    instancia.render = {
      element: elementMap[tipo],
      tipo: typeMap[tipo]
    };
    return instancia;
  }

  static fromObj(obj: any): Campo{
    const campo:any = new Campo();
    for(let prop in campo){
      campo[prop] = obj[prop];
    }
    return campo;
  }
}

export class InstanciaCampo {
  nome!: string;
  label!:string;
  value!: string;
  render!: Render;
  obrigatorio!:boolean;
  width!: number;
  height!: number;
  ajuda!:string;
  dominio: string[] = [];
}

export class InstanciaServico {
  indice!:number;
  label!:string;
  idServico!: string;
  quantidade: number = 1;
  campos: InstanciaCampo[] = [];
  camposResumo!: string[];
  resumo:string = "";
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService extends ApiService<Servico> {
  selectedServico: WritableSignal<Servico> = signal(new Servico())


  public getAllServicos(){
    return this.doGetAll(environment.APIGATEWAY_ROUTES.SERVICOS).pipe(map(
     (result) => {
      if(result.statusCode < 400)
        result.message = result.message.map(Servico.fromObj);
      return result;
     }
    ));
  }

  public getServico(id:string){
    return this.getById(environment.APIGATEWAY_ROUTES.SERVICO, id, true)
  }

  public atualizrServico(servico:Servico) {
    return this.doPost(environment.APIGATEWAY_ROUTES.SERVICO, servico);
  }

  public excluirServico(id: string){
    return this.doDelete(environment.APIGATEWAY_ROUTES.SERVICO, {id: id});
  }

}
