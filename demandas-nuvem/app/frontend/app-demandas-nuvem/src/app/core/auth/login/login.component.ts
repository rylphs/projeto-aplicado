import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Paths } from '../../../app.routes';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  autenticado: boolean = false;
  usuario: string = "rylphs@gmail.com";
  senha: string = "teste";
  falhouLogin = false;

  constructor(private router: Router, private authService:AuthService){}

  login(){
    this.falhouLogin = false;
    this.authService.login(this.usuario, this.senha).subscribe({
      next: (res) => {
        this.router.navigate([Paths.MAIN]);
      },
      error: (error) => {
        this.falhouLogin = true
      }})
  }

}
