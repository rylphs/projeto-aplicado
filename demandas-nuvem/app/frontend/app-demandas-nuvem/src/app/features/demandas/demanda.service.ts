import { Injectable, signal, WritableSignal } from '@angular/core';
import { Demanda } from './demanda-model';
import { ApiService } from '../../core/api/api.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandaService extends ApiService<Demanda>{
  _selectedDemanda: WritableSignal<Demanda> = signal(new Demanda())

  public get selectedDemanda():WritableSignal<Demanda> {
    return this._selectedDemanda;
  }

  public listarDemandas(){
     let userList = this.doGetAll(environment.APIGATEWAY_ROUTES.DEMANDA);
        return userList.pipe(map((result)=>{
          return result.message;
        }));
  }

  criarDemanda(demanda:Demanda){
    return this.doPost(environment.APIGATEWAY_ROUTES.DEMANDA, {payload: demanda}).pipe(map((result)=>{
          if(result.statusCode >= 400)
            throw new Error(result.message.toString())
          return result.message;
        }));
  }

  atualizarDemanda(demanda:Demanda){
    return this.doPut(environment.APIGATEWAY_ROUTES.DEMANDA, {payload: demanda}).pipe(map((result)=>{
          if(result.statusCode >= 400)
            throw new Error(result.message.toString())
          return result.message;
        }));
  }

  excluirDemanda(demanda: Demanda){
     return this.doDelete(`${environment.APIGATEWAY_ROUTES.DEMANDA}?id=${demanda._id}`);
  }
}
