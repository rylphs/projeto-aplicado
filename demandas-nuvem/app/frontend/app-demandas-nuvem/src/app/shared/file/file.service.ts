import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs';
import { Anexo } from '../../features/demandas/demanda-model';

@Injectable({
  providedIn: 'root'
})
export class FileService{
  API_URL = environment.APIGATEWAY_URL;

  constructor(private client: HttpClient){}

  requestUpload(url:string, file: File){
    const headers = new HttpHeaders({
      'Content-Type': file.type,
    });
    const req = new HttpRequest(
        'PUT', url, file, { headers: headers }
      );
    return this.client.request<any>(req);
  }

  requestDownload(url:string){
    const req = new HttpRequest(
        'GET', url, null, { }
      );
    return this.client.request<any>(req);
  }

   updateFile(api:string, folder:string, file: File, prefix?:string) {
    prefix = prefix || "";
    const headers = new HttpHeaders({
      'Content-Type': file.type,
    });
    let key = (folder ? folder + "/" : "") + prefix + "_" + file.name;
    return this.client.post(this.API_URL + "/" + api, {key:key}).pipe(
      switchMap((result:any) => this.requestUpload(result["message"], file))
    )
  }

  downloadFile(api:string, folder:string, name:string) {
    let key = (folder ? folder + "/" : "") + name;
    return this.client.get(`${this.API_URL}/${api}?key=${key}`);
  }

  uploadAsset(folder:string, file:File){
    return this.updateFile("assets", folder, file);
  }

  uploadAnexo(name:string, file:File){
    return this.updateFile("anexos", "", file, name);
  }

  downloadAnexo(anexo:Anexo) {
    console.log(anexo);
    let name = anexo.id + "_" + anexo.nome;
    return this.downloadFile("anexos", "", name);
  }
}
