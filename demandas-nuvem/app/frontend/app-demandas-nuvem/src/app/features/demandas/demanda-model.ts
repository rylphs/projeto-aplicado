import { InstanciaServico } from "../catalogo/servico.service";
import { Usuario } from "../usuarios/usuario.model";



export enum StatusDemanda {
  ABERTA, EM_PREENCHIMENTO,  PREENCHIDA
}

export type Anexo = {
  id: string;
  nome: string;
  tipo: string;
  file?: File;
}

const StatusLabels = {
  ABERTA: "Aberta",
  EM_PREENCHIMENTO: "Em preenchimento",
  PREENCHIDA: "Preenchida"
}

export class Demanda {
  _id!: string;
  descricao!:string;
  cliente!:string;
  emailCliente!:string;
  tecnico!: Usuario;
  gestor!:Usuario;
  status: StatusDemanda = StatusDemanda.ABERTA;
  anexos!: Anexo[];
  servicos: InstanciaServico[] = [];

  static fromData(data:any) {
     let demanda = new Demanda();
     demanda._id = data._id;
     demanda.descricao = data.descricao;
     demanda.cliente = data.cliente;
     demanda.emailCliente = data.emailCliente;
     demanda.tecnico = data.tecnico;
     demanda.gestor = data.gestor;
     demanda.status = data.status;
     demanda.anexos = data.anexos || [];
     demanda.servicos = data.servicos || [];
     return demanda;
  }

  get statusLabel():string {
    console.log(this.status)
    if(!this.status){
      return StatusLabels.ABERTA;
    }
    let key = StatusDemanda[this.status]
    return StatusLabels[key as keyof typeof StatusLabels];
  }
}

let a = {"payload":
  {
    "descricao": "demanda 1",
    "cliente": "cliente1",
    "emailCliente": "cliente@email.com",
    "tecnico": "rylphs@gmail.com",
    "gestor": "jessik.antunes@gmail.com	"
  }
}