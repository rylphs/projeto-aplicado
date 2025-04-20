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

const TIPOS = {
  TEXT: "Text",
  INTEGER: "Inteiro",
  DECIMAL: "Decimal",
  LIST: "Lista",
  MULTILINE_TEXT: "Texto Multilinha",
  BINARY: "Binário",
  OPTION: "Lista de Opções",
  MULTIPLE_OPTION: "Lista de Opções('Múltipla')"
}

const NUMBER_TYPES = ["DECIMAL", "INTEGER"]
const INPUT_TYPES = ["TEXT", "DECIMAL", "INTEGER"]
const SELECT_TYPES = ["BINARY", "OPTION", "MULTIPLE_OPTION"]
const TEXT_AREA_TYPES = ["MULTILINE_TEXT"]
const TABLE_TYPES = ["LIST"]

export type DominioCampo = string[] | Campo

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

  static instanciaFromData(data:any): InstanciaCampo {
    const campo = Campo.fromData(data.metaDados);
    const instancia = campo.criarInstancia();
    if(data.value){
      instancia.value = data.value;
    }
    return instancia;
  }

  static fromData(data: any): Campo{
    const campo:any = new Campo();
    for(let prop in data){
      campo[prop] = data[prop];
    }
    campo.width = campo.width ||
      ([TipoCampo.TEXT, TipoCampo.MULTILINE_TEXT].includes(campo.definicao.tipo) ? 800 : 300)
    campo.height = campo.height || 200
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

  tipos(){
    return TIPOS;
  }

  get inputType(){
    return NUMBER_TYPES.includes(this.definicao.tipo) ? "number" : "text";
  }

  dominioEhLista(){
    return SELECT_TYPES.includes(this.definicao.tipo);
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