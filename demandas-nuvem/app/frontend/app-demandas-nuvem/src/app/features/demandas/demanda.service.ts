import { Injectable, signal, WritableSignal } from '@angular/core';
import { Demanda, StatusDemanda } from './demanda-model';
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
      let demandaList = this.doGetAll(environment.APIGATEWAY_ROUTES.DEMANDA);
        return demandaList.pipe(map((result)=>{
          if(result.statusCode < 400){
            result.message = result.message.map((obj:Demanda) => Demanda.fromData(obj))
          }
          return result;
        }));
  }

  public gerarFormulario(demanda:Demanda){
    demanda.status = StatusDemanda.EM_PREENCHIMENTO;
    return this.atualizarDemanda(demanda);
  }

  public getDemanda(id:string){
    return this.getById("demanda", id).pipe(map(result =>{
      if(result.statusCode < 400){
        result.message = result.message =  Demanda.fromData(result.message)
      }
      return result;
    }));
  }

  criarDemanda(demanda:Demanda){
    return this.doPost(environment.APIGATEWAY_ROUTES.DEMANDA, demanda).pipe(map((result)=>{
          if(result.statusCode >= 400)
            throw new Error(result.message.toString())
          return result.message;
        }));
  }

  atualizarDemanda(demanda:Demanda){
    return this.doPut(environment.APIGATEWAY_ROUTES.DEMANDA, demanda);
  }

  excluirDemanda(demanda: Demanda){
     return this.doDelete(environment.APIGATEWAY_ROUTES.DEMANDA, {id: demanda._id}).pipe(map((result)=>{
      console.log(result)
      if(result.statusCode >= 400)
        throw new Error(result.message.toString())
      return result.message;
    }));
  }
}
