import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import * as _ from 'lodash';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Role } from '../../models/role/role';
import { ApiService } from '../../core/api.service';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

    loading = false;
    title = 'Rollen';
    overlayOpen = false;

    model: any = {};
    roles: Role[];
    referenceRoles: Role[];

    selectedRole: any = {};
    overlaySelected = false;

    constructor(private apiService: ApiService,
                public toastr: ToastsManager,
                private languageService: LanguageService,
                vcr: ViewContainerRef,
                private router: Router,) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    addItem()
    {
        this.overlayOpen = true;
    }

    create()
    {
        this.apiService.post('roles', this.model).then(() => {
            this.getRoles();
            this.overlayOpen = false;
            this.toastr.success('Rol succesvol toegevoegd.', 'Gelukt!');
        }).catch(() => {
            this.toastr.warning('Gegevens onjuist. De naam van de rol bestaat al.', 'Oeps!');
        });
    }

    destroy(id)
    {
        this.apiService.delete('role', id).then(() => {
            this.getRoles();
        });
    }

    getRole(id)
    {
        this.apiService.get('role/' + id).then((role) => {
            this.selectedRole = role;
            this.overlaySelected = true;
        });
    }

    getRoles()
    {
        this.loading = true;
        this.apiService.get('roles').then((roles) => {
            this.roles = roles;
            this.referenceRoles = roles;
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
        this.getRoles();
    }

    ngOnInit()
    {
        this.init();
        this.languageService.languageChanged.subscribe( value => {
            if (value === true && this.router.url === '/roles') {
                this.init();
            }
        });
    }

    setSearchParam(event: any)
    {
        const searchRoles = _.filter(this.referenceRoles, (role) => {
            return role.name.toLowerCase().match(event.target.value.toLowerCase());
        });

        this.roles = searchRoles;
    }

    update(id)
    {
        this.apiService.update('role', this.selectedRole, id).then(() => {
            this.getRoles();
            this.hideOverlay();
        })
    }

    viewDetails(id)
    {
        this.getRole(id);
    }

}
