import { Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { environment } from '../../../environments/environment';
import { map, of } from 'rxjs';
import { Servico } from './servico.model';

@Injectable({
  providedIn: 'root'
})
export class ServicoService extends ApiService<Servico> {
  selectedServico: WritableSignal<Servico> = signal(new Servico())
  servicos: Servico[] = [];


  public getAllServicos(){
    if(this.servicos.length > 0){
      console.log("cache")
      return of({statusCode: 200, message: this.servicos});
    }

    return this.doGetAll(environment.APIGATEWAY_ROUTES.SERVICOS).pipe(map(
     (result) => {
      if(result.statusCode < 400){
        result.message = result.message.map(Servico.fromData);
        this.servicos = result.message;
      }
      return result;
     }
    ));
  }

  public getServico(id:string){
    return this.getById(environment.APIGATEWAY_ROUTES.SERVICO, id, true).pipe(map(response => {
      if(response.statusCode < 400) response.message = Servico.fromData(response.message);
      return response;
    }))
  }

  public atualizrServico(servico:Servico) {
    return this.doPost(environment.APIGATEWAY_ROUTES.SERVICO, servico);
  }

  public excluirServico(id: string){
    return this.doDelete(environment.APIGATEWAY_ROUTES.SERVICO, {id: id});
  }

}
