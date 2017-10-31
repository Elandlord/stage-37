import { Component, OnInit} from '@angular/core';
import {AuthenticateService} from '../login/services/authenticate.service';
import { LanguageService} from '../services/language.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public menuOpen = true;

  model: any = {};
  supportedLanguages: any = [];

  constructor(
      private authenticateService: AuthenticateService,
      private router: Router,
      private languageService: LanguageService)
  {
  }

  logout()
  {
    this.authenticateService.logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
      this.model.lang = localStorage.getItem('lang').replace(/['"]+/g, '');
      this.supportedLanguages = this.languageService.getSupportedLanguages();
  }

  setLanguage(event: any)
  {
    this.languageService.setLanguage(event.target.value);
  }

}
