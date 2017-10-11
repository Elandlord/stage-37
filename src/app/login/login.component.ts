import { Component, OnInit } from '@angular/core';

import { LoginService } from './services/login.service';
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

  constructor(
      private loginService: LoginService,
      private alertService: AlertService
  ) { }

  login() {
    this.loading = true;
    this.loginService.login(this.model.username, this.model.password)
        .subscribe(
            data => {
              console.log('Navigate to dashboard');
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
  }

  ngOnInit() {
  }

}
