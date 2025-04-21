import { Injectable } from '@angular/core';
import { Servico } from './servico.model';
import { ApiService } from '../../core/api/api.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

export class Catalogo {
  _id!: string;
  versao: number = 0;
  servicos: Servico[] = []
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService extends ApiService<Catalogo>{

  public getAllCatalogos(){
    return this.doGetAll(environment.APIGATEWAY_ROUTES.CATALOGO);
  }

  public getCurrentCatalogo(){
    return this.doGetSingle(environment.APIGATEWAY_ROUTES.CATALOGO_ATUAL).pipe(map(response => {
      if(response.statusCode < 400)
        response.message.servicos = response.message.servicos.map(servico => Servico.fromData(servico));
      return response;
    }))
  }

  public gerarVersao(){
    return this.doPost(environment.APIGATEWAY_ROUTES.CATALOGO, {});
  }
}
