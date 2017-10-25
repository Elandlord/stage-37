
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiService {

    constructor(public http: Http) {
    }

    delete(queryString, id)
    {
        return this.http.delete(this.getUrl() + this.getVersion() + queryString + '/' + id,  {
            headers: this.headers()
        }).toPromise()
        .then(response => response.json().data)
        .catch();
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
        return 'http://37company.eu.ngrok.io';
    }

    getVersion() {
        return '/v1/';
    }

    post(queryString, data): Promise<any[]> {
        return this.http.post(this.getUrl() + this.getVersion() + queryString, data, {
            headers: this.headers()
        }).toPromise()
            .then(response => response.json().data)
            .catch();
    }

    update(queryString, data, id): Promise<any[]> {
        return this.http.put(this.getUrl() + this.getVersion() + queryString + '/' + id, data, {
            headers: this.headers()
        }).toPromise()
            .then(response => response.json().data)
            .catch();
    }

}
