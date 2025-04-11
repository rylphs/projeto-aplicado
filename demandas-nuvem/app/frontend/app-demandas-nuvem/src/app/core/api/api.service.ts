import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


export type ListResult<T> = {
  message: T[];
  statusCode: number;
}

export type GetCallResultType<T> = {
  message: T;
  statusCode: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> {
  API_URL = environment.APIGATEWAY_URL;

  constructor(protected client: HttpClient){}

  protected doGetAny(path: string): Observable<any> {
    return this.client.get(`${this.API_URL}/${path}`);
  }

  protected doGetAll(path: string): Observable<ListResult<T>> {
    return this.client.get<ListResult<T>>(`${this.API_URL}/${path}`);
  }

  protected doGetSingle(path: string): Observable<T> {
    return this.client.get<T>(`${this.API_URL}/${path}`);
  }

  protected doPost(path: string, data: any): Observable<GetCallResultType<T>> {
    return this.client.post<GetCallResultType<T>>(`${this.API_URL}/${path}`, data);
  }

  protected doPatch(path: string, data: any): Observable<T> {
    return this.client.patch<T>(`${this.API_URL}/${path}`, data);
  }

  protected doPut(path: string, data: any): Observable<GetCallResultType<T>> {
    return this.client.put<GetCallResultType<T>>(`${this.API_URL}/${path}`, data);
  }

  protected doDelete(path: string): Observable<string> {
    return this.client.delete<string>(`${this.API_URL}/${path}`);
  }
}
