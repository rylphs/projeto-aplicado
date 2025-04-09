
export enum UserRole {
  GESTOR = "Gestor",
  RESPONSAVEL_TECNICO = "Responsável Técnico",
  VISITANTE = "Visitante"
}

export class Usuario {
  _id!: string;
  email!: string;
  nome!: string;
  thumb!: string;
  role!: String;
  roleName!: string;

  static fromDadosUsuario(data:any):Usuario{
    let usuario:Usuario = new Usuario();
    usuario._id = data._id;
    usuario.email = data.email;
    usuario.nome = data.nome;
    usuario.thumb = data.thumb;
    let roleName = data.role.toString();
    if(roleName in UserRole){
      usuario.role = UserRole[roleName as keyof typeof UserRole];
    }
    return usuario;
  }

}