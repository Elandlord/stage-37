import { Component, OnInit } from '@angular/core';

import { Country } from '../../models/country/country';
import { User} from '../../models/user/user';
import { Role } from "../../models/role/role";
import { ApiService } from '../../core/api.service';


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
  countries: Country[];
  roles: Role[];

  selectedUser: any = {};
  overlaySelected = false;

  constructor(private apiService: ApiService) { }

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('users', this.model).then(() => {
            this.getUsers();
            this.overlayOpen = false;
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
          this.loading = false;
      });
    }

    hideOverlay()
    {
        this.overlayOpen = false;
        this.overlaySelected = false;
    }

    ngOnInit()
    {
        this.getUsers();
        this.getCountries();
        this.getRoles();
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
