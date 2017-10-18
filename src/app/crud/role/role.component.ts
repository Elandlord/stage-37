import {Component, OnInit, ViewContainerRef} from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Role } from '../../models/role/role';
import { ApiService } from '../../core/api.service';

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

    selectedRole: any = {};
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
        this.apiService.post('roles', this.model).then(() => {
            this.getRoles();
            this.overlayOpen = false;
            this.toastr.success('Rol succesvol toegevoegd.', 'Gelukt!');
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
        this.getRoles();
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
