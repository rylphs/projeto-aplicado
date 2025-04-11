import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';

export type MessageType = {
  message: string;
}

type SubjectEntry = {
  [key:string]: Subject<MessageType>
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  subjects: SubjectEntry = {}

  constructor() { }

  getSubject(name:string): Subject<MessageType> {
    if(!this.subjects[name]){
      console.log("criando signal " + name)
      this.subjects[name] = new Subject();
    }
    return this.subjects[name];
  }
}
