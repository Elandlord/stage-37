import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private url = 'https://api.37company.rapide.software/v1/oauth/token';

  constructor(private http: Http) { }



  login(username: string, password: string) {
      const headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Accept', 'application/json');

      const body = new URLSearchParams();
      body.append('client_id', '1');
      body.append('client_secret', 'KYPNzeZY9jYlRYOncvNqONYNp8a0KIiI4ZR0eQtk');
      body.append('scope', '');
      body.append('grant_type', 'password');
      body.append('username', username);
      body.append('password', password);

      return this.http
          .post(this.url, body, {headers: headers})
          .map((res: Response) => {
            let user = res.json();
            if (user && user.access_token){
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
          })
          .catch(this.handleError);
  }

  logout(){
      localStorage.removeItem('currentUser')
  }

  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error);
      return Promise.reject(error.message || error);
  }

}
