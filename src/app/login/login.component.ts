import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AuthenticateService } from './services/authenticate.service';
import { AlertService } from '../services/alert.service';

import { AppRoutingModule} from '../app-routing/app-routing.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticateService: AuthenticateService,
        private alertService: AlertService
    ) { }

  login() {
    this.loading = true;
    this.authenticateService.login(this.model.username, this.model.password)
        .subscribe(
            data => {
              this.router.navigate(['/login']);
            },
            error => {
              this.alertService.error('Combinatie van gebruikersnaam en wachtwoord onjuist.');
              this.loading = false;
            });
  }

  ngOnInit() {
    this.authenticateService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

}
