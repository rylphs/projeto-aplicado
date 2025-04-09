import { AfterViewInit, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Paths } from '../../../app.routes';
import { Usuario } from '../../../features/usuarios/usuario.model';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-logged-area',
  imports: [MatButtonModule, MatIconModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './logged-area.component.html',
  styleUrl: './logged-area.component.css'
})
export class LoggedAreaComponent implements AfterViewInit{
  breadcrumbItens!: string[]

  constructor(private route:ActivatedRoute, private router:Router, public sanitizer: DomSanitizer,
    private authService:AuthService){
    if(!authService.isLogged()){
      this.router.navigate([Paths.LOGIN]);
    }
    this.breadcrumbItens = this.route.snapshot.firstChild!.data['breadcrumb']
  }

  ngAfterViewInit(){
   // console.log();
  }

  get currentUser(): Usuario | null{
    return this.authService.currentUser;
  }
}
