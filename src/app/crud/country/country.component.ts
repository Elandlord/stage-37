import { Component, OnInit } from '@angular/core';

import { Country } from '../../models/country/country';
import {ApiService} from '../../core/api.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

    loading = false;

    title = 'Landen';
    countries: Country[];

    constructor(private apiService: ApiService) { }

    getCountries()
    {
      this.loading = true;
        this.apiService.get('countries').then((countries) => {
          this.countries = countries;
          this.loading = false;
        });
    }

  ngOnInit()
  {
    this.getCountries();
  }

}
