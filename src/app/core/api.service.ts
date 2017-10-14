import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiService {

    constructor(public http: Http) {
    }

    headers() {
        const JSONuser = JSON.parse(localStorage.getItem('currentUser'));
        const token = 'Bearer ' + JSONuser.access_token;
        const headers = new Headers({
            'Accept': 'application/json',
            'Authorization': token
        });
        return headers;
    }

    get(queryString): Promise<any[]> {
        return this.http.get(this.getUrl() + this.getVersion() + queryString, {
            headers: this.headers()
        }).toPromise()
            .then(response => response.json().data)
            .catch();
    }

    getUrl() {
        return 'https://api.37company.rapide.software';
    }

    getVersion() {
        return '/v1/';
    }

}
