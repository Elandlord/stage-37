import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import * as _ from 'lodash';

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
    referenceCountries: Country[];

    constructor(private apiService: ApiService,
                private languageService: LanguageService,
                private router: Router,) { }

    getCountries()
    {
      this.loading = true;
        this.apiService.get('countries').then((countries) => {
          this.countries = countries;
          this.referenceCountries = countries;
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
          if (value === true && this.router.url === '/countries') {
              this.init();
          }
      });
    }

    setSearchParam(event: any)
    {
        const searchCountries = _.filter(this.referenceCountries, (country) => {
            return country.name.toLowerCase().match(event.target.value.toLowerCase());
        });

        this.countries = searchCountries;
    }

}
