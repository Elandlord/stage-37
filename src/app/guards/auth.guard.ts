import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import * as moment from 'moment';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


        const now = moment();
        const access_token_validity_date = moment(JSON.parse(localStorage.getItem('valid_until')));

        // if current user exists, and access token is still valid
        if (localStorage.getItem('currentUser') !== null || now < access_token_validity_date)
        {
            return true;
        }

        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
