import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            console.log('ingelogd');
            return true;
        }

        console.log('Niet ingelogd');
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
