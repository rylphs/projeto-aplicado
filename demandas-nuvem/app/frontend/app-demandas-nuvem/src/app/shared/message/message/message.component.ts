import { MessageType } from './../message.service';
import { Component, Input, Signal, WritableSignal } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() messageFor: string = "";
  messageSignal!: WritableSignal<MessageType>;

  constructor(private messageService: MessageService){
    if(this.messageFor){
     // this.messageSignal = messageService.getSubject(this.messageFor);
    }
  }

  get mensagem():MessageType{
    return this.messageSignal();
  }

  close(){
    this.messageSignal.set({message:""})
  }
}
