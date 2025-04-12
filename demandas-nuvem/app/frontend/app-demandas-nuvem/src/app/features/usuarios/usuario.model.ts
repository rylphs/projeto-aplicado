
export enum UserRole {
  GESTOR = "Gestor",
  TECNICO = "Técnico",
  ADMIN = "Administrador"
}

export class Usuario {
  _id!: string;
  email!: string;
  nome!: string;
  thumb!: string;
  role!: String;
  inativo: boolean = false;

  static fromDadosUsuario(data:any):Usuario{
    let usuario:Usuario = new Usuario();
    usuario._id = data._id;
    usuario.email = data.email;
    usuario.nome = data.nome;
    usuario.thumb = data.thumb;
    usuario.role = data.role;
    usuario.inativo = data.inativo;
    return usuario;
  }

  get roleName():string {
    return UserRole[this.role as keyof typeof UserRole];
  }

  toString(){
    return this.nome;
  }

}