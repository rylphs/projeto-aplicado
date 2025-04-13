import { environment } from './../../../../environments/environment';
import { AuthService } from './../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Component, Input, signal, WritableSignal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-avatar',
  imports: [MatIcon, CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  @Input("file") fileSignal!: WritableSignal<File|null>;
  file: string = "";

  constructor(authService: AuthService){
    const thumb = authService.currentUser?.thumb;
    if(thumb){
      this.file = environment.USER_THUMBS_URL + "/" + thumb;
    }
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.fileSignal.set(files[0])
      this.file = _file;
      this.resetInput();
    }
  }

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }
}
