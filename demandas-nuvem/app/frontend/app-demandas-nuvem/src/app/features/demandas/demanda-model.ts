import { Usuario } from "../usuarios/usuario.model";

export class Demanda {
  _id!: string;
  descricao!:string;
  cliente!:string;
  emailCliente!:string;
  tecnico!: Usuario;
  gestor!:Usuario;
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