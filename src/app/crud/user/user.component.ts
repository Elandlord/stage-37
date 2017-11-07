import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import * as _ from 'lodash';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Country } from '../../models/country/country';
import { User} from '../../models/user/user';
import { Role } from '../../models/role/role';
import { ApiService } from '../../core/api.service';
import {LanguageService} from '../../services/language.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  loading = false;
  title = 'Gebruikers';
  overlayOpen = false;

  model: any = {};
  users: User[];
  referenceUsers: User[];
  countries: Country[];
  roles: Role[];

  selectedUser: any = {};
  overlaySelected = false;

  constructor(private apiService: ApiService,
              public toastr: ToastsManager,
              private languageService: LanguageService,
              vcr: ViewContainerRef,
              private router: Router) {
      this.toastr.setRootViewContainerRef(vcr);
  }

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('users', this.model).then(() => {
            this.getUsers();
            this.overlayOpen = false;
            this.toastr.success('Gebruiker succesvol toegevoegd.', 'Gelukt!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('user', id).then(() => {
            this.getUsers();
        });
    }

    getUser(id)
    {
        this.apiService.get('user/' + id).then((role) => {
            this.selectedUser = role;
            this.overlaySelected = true;
        });
    }

    getCountries()
    {
        this.apiService.get('countries').then((countries) => {
            this.countries = countries;
            this.loading = false;
        });
    }

    getFunctionById(id)
    {
        if(this.roles !== undefined && id !== null)
        {
            return _.find(this.roles, (role) => role.id === id);
        }
        return 'Geen';
    }

    getRoles()
    {
        this.apiService.get('roles').then((roles) => {
            this.roles = roles;
            this.loading = false;
        });
    }

    getUsers()
    {
      this.loading = true;
      this.apiService.get('users').then((users) => {
          this.users = users;
          this.referenceUsers = users;
          this.loading = false;
      });
    }

    hideOverlay()
    {
        this.overlayOpen = false;
        this.overlaySelected = false;
    }

    init()
    {
        this.getUsers();
        this.getCountries();
        this.getRoles();
    }


    ngOnInit()
    {
        this.init();
        this.languageService.languageChanged.subscribe( value => {
            if (value === true && this.router.url === '/users') {
                this.init();
            }
        });
    }

    setSearchParam(event: any)
    {
        const searchUsers = _.filter(this.referenceUsers, (user) => {
            return user.name.toLowerCase().match(event.target.value.toLowerCase());
        });

        this.users = searchUsers;
    }

    update(id)
    {
        this.apiService.update('role', this.selectedUser, id).then(() => {
            this.getUsers();
            this.hideOverlay();
        });
    }

    viewDetails(id)
    {
        this.getUser(id);
    }

}
