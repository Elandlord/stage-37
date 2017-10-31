import { Component, OnInit } from '@angular/core';

import { Country } from '../../models/country/country';
import {ApiService} from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

    loading = false;

    title = 'Landen';
    countries: Country[];

    constructor(private apiService: ApiService, private languageService: LanguageService) { }

    getCountries()
    {
      this.loading = true;
        this.apiService.get('countries').then((countries) => {
          this.countries = countries;
          this.loading = false;
        });
    }

    init()
    {
        this.getCountries();
    }

  ngOnInit()
  {
      this.init();
      this.languageService.languageChanged.subscribe( value => {
          if (value === true) {
              this.init();
          }
      });
  }

}
