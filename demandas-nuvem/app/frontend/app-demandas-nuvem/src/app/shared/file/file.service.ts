import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs';

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
    let key = file.name
    const req = new HttpRequest(
        'PUT', url, file, { headers: headers }
      );
    return this.client.request<any>(req);
  }

   updateFile(folder:string, file: File) {
    const headers = new HttpHeaders({
      'Content-Type': file.type,
    });
    let key = folder + "/" + file.name;
    return this.client.post(this.API_URL + "/assets", {key:key}).pipe(
      switchMap((result:any) => this.requestUpload(result["message"], file))
    )
  }
}
