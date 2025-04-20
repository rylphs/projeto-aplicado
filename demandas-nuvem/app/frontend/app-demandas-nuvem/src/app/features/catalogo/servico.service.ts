import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import { Servico } from './servico.model';

@Injectable({
  providedIn: 'root'
})
export class ServicoService extends ApiService<Servico> {
  selectedServico: WritableSignal<Servico> = signal(new Servico())


  public getAllServicos(){
    return this.doGetAll(environment.APIGATEWAY_ROUTES.SERVICOS).pipe(map(
     (result) => {
      if(result.statusCode < 400)
        result.message = result.message.map(Servico.fromData);
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
