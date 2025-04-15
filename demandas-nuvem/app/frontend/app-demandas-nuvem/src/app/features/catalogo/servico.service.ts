import { Injectable } from '@angular/core';
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

export type OpcoesTipoCampo = "combobox" | "texto" | "numerico" | "boleano";

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

  static fromObj(obj: any): Servico {
    const servico:any = new Servico();
    for(let prop in servico){
      if (prop == "campos" && obj.campos) {
        servico.campos = obj.campos.map((campo:Campo) => Campo.fromObj(campo));
      }
      else servico[prop] = obj[prop];
    }
    return servico;
  }

  criarInstancia(): InstanciaServico {
    const instancia = new InstanciaServico();
    instancia.idServico = this._id;
    instancia.label = this.label;
    for(let i in this.campos){
      let instanciaCampo = this.campos[i].criarInstancia();
      instancia.campos.push(instanciaCampo);
    }
    return instancia;
  }

}

export type Render = {
  element: string;
  tipo: OpcoesTipoCampo;
}

const elementMap = {
  "texto": "input",
  "numerico": "input",
  "combobox": "combobox",
  "boleano": "checkbox"
}

export class Campo {
  nome!: string;
  label!: string;
  tipoCampo!: TipoCampo;
  obrigatorio!: boolean;
  valorDefault!: string;


  criarInstancia():InstanciaCampo {
    const instancia = new InstanciaCampo();
    instancia.nome = this.nome;
    instancia.value = this.valorDefault;
    instancia.label = this.label;
    instancia.obrigatorio = this.obrigatorio;
    let tipo = this.tipoCampo.tipo;
    instancia.render = {
      element: elementMap[tipo],
      tipo: tipo
    };
    return instancia;
  }

  static fromObj(obj: any): Campo{
    const campo:any = new Campo();
    for(let prop in campo){
      campo[prop] = obj[prop] || campo[prop];
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
}

export class InstanciaServico {
  label!:string;
  idServico!: string;
  quantidade: number = 1;
  campos: InstanciaCampo[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService extends ApiService<Servico> {

  public getAllServicos(){
    return this.doGetAll(environment.APIGATEWAY_ROUTES.SERVICOS).pipe(map(
     (result) => {
      if(result.statusCode < 400)
        result.message = result.message.map(Servico.fromObj);
      return result;
     }
    ));
  }
}
