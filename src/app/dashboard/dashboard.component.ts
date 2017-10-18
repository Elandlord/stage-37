import { Component, OnInit } from '@angular/core';
import {AuthenticateService} from '../login/services/authenticate.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public menuOpen = true;

  constructor(
      private authenticateService: AuthenticateService,
      private router: Router)
  {
  }

  logout()
  {
    this.authenticateService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}
