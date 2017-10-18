import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Country } from '../../models/country/country';
import { User} from '../../models/user/user';
import { Role } from '../../models/role/role';
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

  constructor(private apiService: ApiService, public toastr: ToastsManager, vcr: ViewContainerRef) {
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
        if(this.roles !== undefined)
        {
            for (let role of this.roles)
            {
                if (role.id === id)
                {
                    return role.name;
                }
            }
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
