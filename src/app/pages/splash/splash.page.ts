import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router, private db: DbService) { }

  ngOnInit() {
    setTimeout(() => {
      this.db.validarSesion().then(data => {
            if (data == 0) {
              this.router.navigate(['login'], { replaceUrl: true});
            } else {
              this.router.navigate(['principal'], { replaceUrl: true})
            }
          })
    }, 3000);
  }

}
