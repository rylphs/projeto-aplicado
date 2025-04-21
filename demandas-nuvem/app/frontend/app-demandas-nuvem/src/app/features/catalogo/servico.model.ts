import { Campo, InstanciaCampo } from "./campo.model";
export class InstanciaServico {
  quantidade!: number;
  metaData!: Servico;
  campos: InstanciaCampo[] = [];
  id!: number;

  getResumo(){
    const camposResumo = this.metaData.resumo;
    return this.campos.filter((campo) => camposResumo.includes(campo.nome))
      .map((campo)=> {
        return `${campo.nome}=${campo.value}`;
      }).join(", ");
  }

  copy(){
    const copy = new InstanciaServico();
    copy.quantidade = this.quantidade;
    copy.metaData = this.metaData;
    copy.id = this.id;
    copy.campos  =this.campos.map(instancia => {
      return {
        nome: instancia.metaDados.nome,
        metaDados: instancia.metaDados,
        value: instancia.value
      }
    })
    return copy;
  }
}

export class Servico {
  _id!: string;
  nome!: string;
  label!: string;
  descricao!: string;
  campos: Campo[] = [];
  resumo!: string[];
  catalogo!: number;
  multiplo: boolean = false;

  static fromData(data: any, index?:number, servicos?:Servico[]): Servico {
    const servico:any = new Servico();
    for(let prop in servico){
      if (prop == "campos" && data.campos) {
        servico.campos = data.campos.map((campo:Campo) => Campo.fromData(campo, servicos));
      }
      else servico[prop] = data[prop];
    }
    return servico;
  }

  static instanciaFromData(data:any): InstanciaServico {
    const servico = Servico.fromData(data.metaData);
    const instancia = new InstanciaServico();

    instancia.id = data.id;
    instancia.metaData = servico;
    instancia.quantidade = data.quantidade;
    instancia.campos = data.campos.map((instancia:any) => Campo.instanciaFromData(instancia))
    return instancia;
  }

  criarInstancia(): InstanciaServico {
    const instancia = new InstanciaServico();
    instancia.quantidade = 1;
    instancia.metaData = this;
    instancia.campos = this.campos.map((campo)=>campo.criarInstancia())
    return instancia;
  }

}