import { AfterViewInit, Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterOutlet, RouterLink, RouterLinkActive, Router, ChildActivationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Paths } from '../../../app.routes';
import { Usuario } from '../../../features/usuarios/usuario.model';
import { DomSanitizer } from '@angular/platform-browser';
import { md5 } from 'js-md5';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-logged-area',
  imports: [MatButtonModule, MatIconModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './logged-area.component.html',
  styleUrl: './logged-area.component.css'
})
export class LoggedAreaComponent {
  breadcrumbItens!: string[]

  constructor(private route:ActivatedRoute, private router:Router, public sanitizer: DomSanitizer,
    private authService:AuthService){
    if(!authService.isLogged()){
      this.router.navigate([Paths.LOGIN]);
    }
    //console.log(this.route.snapshot.firstChild!.data);
    this.router.events.subscribe((event)=>{
      if(event instanceof ChildActivationEnd){
        this.breadcrumbItens = this.route.snapshot.firstChild!.data['breadcrumb'];
      }
    });

  }

  get userPicture():string {
    if(this.currentUser){
      let base_url = environment.USER_THUMBS_URL;
      let image = this.currentUser.thumb ? this.currentUser.thumb : "default.png";
      return base_url + "/" +  image;
    }
    return "";
  }

  get currentUser(): Usuario | null{
    return this.authService.currentUser;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(["login"]);
  }
}
