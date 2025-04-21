import { Servico } from "./servico.model"

export enum TipoCampo {
  TEXT = "TEXT",
  INTEGER = "INTEGER",
  DECIMAL = "DECIMAL",
  LIST = "LIST",
  MULTILINE_TEXT = "MULTILINE_TEXT",
  BINARY = "BINARY",
  OPTION = "OPTION",
  MULTIPLE_OPTION = "MULTIPLE_OPTION"
}

export const TIPOS = {
  TEXT: "Text",
  INTEGER: "Inteiro",
  DECIMAL: "Decimal",
  LIST: "Lista de Serviços",
  MULTILINE_TEXT: "Texto Multilinha",
  BINARY: "Binário",
  OPTION: "Lista de Opções",
  MULTIPLE_OPTION: "Lista de Opções ('Múltipla')"
}

const NUMBER_TYPES = ["DECIMAL", "INTEGER"]
const INPUT_TYPES = ["TEXT", "DECIMAL", "INTEGER"]
const SELECT_TYPES = ["BINARY", "OPTION", "MULTIPLE_OPTION"]
const TEXT_AREA_TYPES = ["MULTILINE_TEXT"]
const TABLE_TYPES = ["LIST"]

export type DominioCampo = string[] | string

export type DefinicaoCampo = {
  tipo: TipoCampo;
  dominio?: DominioCampo
}

export type InstanciaCampo = {
  nome: string;
  metaDados: Campo;
  value: any;
}

export class Campo {
  nome!: string;
  label!: string;
  ajuda!: string;
  ordem:number = 0;
  width!:number;
  height!: number;

  definicao: DefinicaoCampo = {tipo: TipoCampo.TEXT};
  obrigatorio!: boolean;
  default!: string;

  static tipos = Object.entries(TIPOS).map(entry => { return {key: entry[0], value: entry[1]}});

  static instanciaFromData(data:any): InstanciaCampo {
    const campo = Campo.fromData(data.metaDados);
    const instancia = campo.criarInstancia();
    if(data.value){
      instancia.value = data.value;
    }
    return instancia;
  }

  static fromData(data: any, servicos?:Servico[]): Campo{
    servicos = servicos || [];
    const campo:Campo = new Campo();
    for(let prop in data){
      (campo as any)[prop] = data[prop];
    }
    campo.width = campo.width ||
      ([TipoCampo.TEXT, TipoCampo.MULTILINE_TEXT].includes(campo.definicao.tipo) ? 800 : 300)
    campo.height = campo.height || 200;
    /*if(campo.dominioEhServico()){
      const idServico = campo.definicao.dominio || "";
      const servico = servicos.find((servico)=>servico._id == idServico)
      if(servico) {
        console.log("Carregando servico", servico)
        campo.definicao.dominio = Servico.fromData(servico);
      }
    }*/
    return campo;
  }

  configurarInstancia(instancia: InstanciaCampo){
    instancia.metaDados = this;
    return instancia;
  }

  criarInstancia():InstanciaCampo {
    return {
      nome: this.nome,
      metaDados: this,
      value: this.default || ([TipoCampo.LIST, TipoCampo.MULTIPLE_OPTION].includes(this.definicao.tipo) ? [] : "")
    }
  }

  get inputType(){
    return NUMBER_TYPES.includes(this.definicao.tipo) ? "number" : "text";
  }

  dominioEhLista(){
    return SELECT_TYPES.includes(this.definicao.tipo);
  }

  dominioEhServico(){
    return this.isTable();
  }

  isInput(){
    return INPUT_TYPES.includes(this.definicao.tipo)
  }

  isSelect(){
    return SELECT_TYPES.includes(this.definicao.tipo);
  }

  isTextArea(){
    return TEXT_AREA_TYPES.includes(this.definicao.tipo);
  }

  isTable(){
    return TABLE_TYPES.includes(this.definicao.tipo);
  }

  get className(){
    return this.definicao.tipo.toLowerCase();
  }

  get listaOpcoes(): string[] {
    if(this.definicao.dominio instanceof Array)
      return this.definicao.dominio as string[];
    return [];
  }

}